import { IsNotEmpty, IsOptional } from 'class-validator';

export class CommentDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  postId: string;

  @IsOptional()
  parentId: string;
}
