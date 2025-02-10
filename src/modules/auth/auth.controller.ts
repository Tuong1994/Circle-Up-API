import { Body, Controller, HttpCode, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthChangePasswordDto, AuthEmailDto, AuthSignInDto, AuthSignUpDto } from './auth.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('validateEmail')
  @HttpCode(HttpStatus.OK)
  validateEmail(@Body() auth: AuthEmailDto) {
    return this.authService.validateEmail(auth);
  }

  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  signIn(@Res() res: Response, @Body() auth: AuthSignInDto) {
    return this.authService.signIn(res, auth);
  }

  @Post('signUp')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() auth: AuthSignUpDto) {
    return this.authService.signUp(auth);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Query() query: QueryDto) {
    return this.authService.refresh(query);
  }

  @Post('changePassword')
  @HttpCode(HttpStatus.OK)
  changePassword(@Query() query: QueryDto, @Body() auth: AuthChangePasswordDto) {
    return this.authService.changePassword(query, auth);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res() res: Response, @Query() query: QueryDto) {
    return this.authService.logout(res, query);
  }
}
