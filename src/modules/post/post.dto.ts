import { IsNotEmpty } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  userId: string;
}
