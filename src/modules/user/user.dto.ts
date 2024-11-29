import { IsNotEmpty, IsOptional } from 'class-validator';
import { EAudience, ERole } from 'src/common/enum/base';
import { EUserInfoType } from './user.enum';

class DateRangeDto {
  @IsOptional()
  id: string;

  @IsNotEmpty()
  year: number;

  @IsNotEmpty()
  month: number;

  @IsNotEmpty()
  date: number;
}

export class UserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  role: ERole;
}

export class UserInfoDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  type: EUserInfoType;

  @IsNotEmpty()
  audience: EAudience;

  @IsNotEmpty()
  userId: string;
}

export class UserWorkDto {
  @IsNotEmpty()
  company: string;

  @IsNotEmpty()
  position: string;

  @IsNotEmpty()
  cityCode: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  audience: EAudience;

  @IsNotEmpty()
  isCurrently: boolean;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  startDate: DateRangeDto;

  @IsOptional()
  endDate: DateRangeDto;
}

export class UserEducationDto {
  @IsNotEmpty()
  school: string;

  @IsNotEmpty()
  audience: EAudience;

  @IsNotEmpty()
  isGraduated: boolean;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  startDate: DateRangeDto;

  @IsOptional()
  endDate: DateRangeDto;
}

export class UserLivedDto {
  @IsNotEmpty()
  cityCode: number;

  @IsNotEmpty()
  districtCode: number;

  @IsNotEmpty()
  audience: EAudience;

  @IsNotEmpty()
  userId: string;
}
