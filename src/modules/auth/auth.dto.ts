import { IsNotEmpty } from 'class-validator';

export class AuthEmailDto {
  @IsNotEmpty()
  email: string;
}

export class AuthSignInDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class AuthSignUpDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}

export class AuthChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;
}
