import { IsArray, IsEmail, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class EmailContactDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;
}
