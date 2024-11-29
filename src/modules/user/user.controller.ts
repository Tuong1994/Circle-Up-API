import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { UserDto, UserEducationDto, UserInfoDto, UserLivedDto, UserWorkDto } from './user.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getUsers(@QueryPaging() query: QueryDto) {
    return this.userService.getUsers(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  getUser(@Query() query: QueryDto) {
    return this.userService.getUser(query);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }

  @Post('createInfo')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  createUserInfo(@Body() info: UserInfoDto) {
    return this.userService.createUserInfo(info);
  }

  @Post('createWork')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  createUserWork(@Body() work: UserWorkDto) {
    return this.userService.createUserWork(work);
  }

  @Post('createEducation')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  createUserEducation(@Body() education: UserEducationDto) {
    return this.userService.createUserEducation(education);
  }

  @Post('createLived')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  createUserLived(@Body() lived: UserLivedDto) {
    return this.userService.createUserLived(lived);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  updateUser(@Query() query: QueryDto, @Body() user: UserDto) {
    return this.userService.updateUser(query, user);
  }

  @Put('updateInfo')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  updateUserInfo(@Query() query: QueryDto, @Body() info: UserInfoDto) {
    return this.userService.updateUserInfo(query, info);
  }

  @Put('updateWork')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  updateUserWork(@Query() query: QueryDto, @Body() work: UserWorkDto) {
    return this.userService.updateUserWork(query, work);
  }

  @Put('updateEducation')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  updateUserEducation(@Query() query: QueryDto, @Body() education: UserEducationDto) {
    return this.userService.updateUserEducation(query, education);
  }

  @Put('updateLived')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  updateUserLived(@Query() query: QueryDto, @Body() lived: UserLivedDto) {
    return this.userService.updateUserLived(query, lived);
  }

  @Put('remove')
  @HttpCode(HttpStatus.OK)
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  removeUsers(@Query() query: QueryDto) {
    return this.userService.removeUsers(query);
  }

  @Delete('removePermanent')
  @HttpCode(HttpStatus.OK)
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  removeUsersPermanent(@Query() query: QueryDto) {
    return this.userService.removeUsersPermanent(query);
  }
}
