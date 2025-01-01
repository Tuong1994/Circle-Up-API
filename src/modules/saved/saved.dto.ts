import { IsNotEmpty } from 'class-validator';

export class SavedDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  postId: string;
}
