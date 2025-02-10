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
import { UserDto, UserEducationDto, UserInfoDto, UserLivedDto, UserUpdateDto, UserWorkDto } from './user.dto';
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
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getUser(@Query() query: QueryDto) {
    return this.userService.getUser(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }

  @Post('createInfo')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createUserInfo(@Body() info: UserInfoDto) {
    return this.userService.createUserInfo(info);
  }

  @Post('createWork')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createUserWork(@Body() work: UserWorkDto) {
    return this.userService.createUserWork(work);
  }

  @Post('createEducation')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createUserEducation(@Body() education: UserEducationDto) {
    return this.userService.createUserEducation(education);
  }

  @Post('createLived')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createUserLived(@Body() lived: UserLivedDto) {
    return this.userService.createUserLived(lived);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateUser(@Query() query: QueryDto, @Body() user: UserUpdateDto) {
    return this.userService.updateUser(query, user);
  }

  @Put('updateInfo')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateUserInfo(@Query() query: QueryDto, @Body() info: UserInfoDto) {
    return this.userService.updateUserInfo(query, info);
  }

  @Put('updateWork')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateUserWork(@Query() query: QueryDto, @Body() work: UserWorkDto) {
    return this.userService.updateUserWork(query, work);
  }

  @Put('updateEducation')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateUserEducation(@Query() query: QueryDto, @Body() education: UserEducationDto) {
    return this.userService.updateUserEducation(query, education);
  }

  @Put('updateLived')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateUserLived(@Query() query: QueryDto, @Body() lived: UserLivedDto) {
    return this.userService.updateUserLived(query, lived);
  }

  @Delete('remove')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeUsers(@Query() query: QueryDto) {
    return this.userService.removeUsers(query);
  }

  @Delete('removePermanent')
  // @Roles(ERole.LEADER, ERole.MANAGER)
  // @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeUsersPermanent(@Query() query: QueryDto) {
    return this.userService.removeUsersPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreUsers() {
    return this.userService.restoreUsers();
  }
}
