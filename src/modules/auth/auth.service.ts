import * as bcryptjs from 'bcryptjs';
import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthChangePasswordDto, AuthSignInDto, AuthSignUpDto } from './auth.dto';
import { TokenPayload } from './auth.type';
import { AuthHelper } from './auth.helper';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { EAudience, ERole } from 'src/common/enum/base';
import { QueryDto } from 'src/common/dto/query.dto';
import utils from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private authHelper: AuthHelper,
    private jwt: JwtService,
  ) {}

  async signIn(res: Response, auth: AuthSignInDto) {
    const { email, password } = auth;
    const isRegistered = await this.prisma.userEmail.findUnique({
      where: { email },
      include: { user: true },
    });
    if (!isRegistered) throw new HttpException('Email is not correct', HttpStatus.NOT_FOUND);
    const isAuth = bcryptjs.compareSync(password, isRegistered.user.password);
    if (!isAuth) throw new ForbiddenException('Password is not correct');
    const data = {
      email: isRegistered.email,
      firstName: isRegistered.user.firstName,
      lastName: isRegistered.user.lastName,
    };
    const payload: TokenPayload = {
      email,
      role: isRegistered.user.role,
      id: isRegistered.user.id,
    };
    const accessToken = await this.authHelper.getAccessToken(payload);
    const refreshToken = await this.authHelper.getRefreshToken(payload);
    await this.prisma.auth.upsert({
      where: { userId: isRegistered.user.id },
      create: { token: refreshToken, userId: isRegistered.user.id },
      update: { token: refreshToken },
    });
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ token: accessToken.token, exp: accessToken.exp, isAuth: true, payload: data });
  }

  async signUp(auth: AuthSignUpDto) {
    const { email, password, firstName, lastName } = auth;
    const isExisted = await this.prisma.userEmail.findUnique({ where: { email } });
    if (isExisted) throw new ForbiddenException('Email is already exist');
    const hash = utils.bcryptHash(password);
    const register = await this.prisma.user.create({
      data: { password: hash, firstName, lastName, isDelete: false, role: ERole.USER },
    });
    await this.prisma.userEmail.create({
      data: { email, userId: register.id, audience: EAudience.PUBLIC, isDelete: false },
    });
    return register;
  }

  async refresh(query: QueryDto) {
    const { userId } = query;
    const auth = await this.prisma.auth.findUnique({ where: { userId } });
    if (!auth) throw new ForbiddenException('Token is not found');
    try {
      const decode = this.jwt.verify(auth.token, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      }) as TokenPayload;
      const payload: TokenPayload = { id: decode.id, email: decode.email, role: decode.role };
      const { token, exp } = await this.authHelper.getAccessToken(payload);
      return { token, exp };
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new ForbiddenException('Token is expired');
    }
  }

  async changePassword(query: QueryDto, auth: AuthChangePasswordDto) {
    const { userId } = query;
    const { oldPassword, newPassword } = auth;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('User not found');
    const isAuth = bcryptjs.compareSync(oldPassword, user.password);
    if (!isAuth) throw new ForbiddenException('Password is not correct');
    const hash = utils.bcryptHash(newPassword);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hash } });
    throw new HttpException('Password has successfully changed', HttpStatus.OK);
  }

  async logout(res: Response, query: QueryDto) {
    const { userId } = query;
    const auth = await this.prisma.auth.findUnique({ where: { userId } });
    if (!auth) throw new HttpException('Logout success', HttpStatus.OK);
    await this.prisma.auth.delete({ where: { id: auth.id } });
    res.cookie('token', '', { maxAge: 0, httpOnly: true });
    throw new HttpException('Logout success', HttpStatus.OK);
  }
}
