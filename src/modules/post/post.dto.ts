import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { EPostFeeling } from './post.enum';
import { EAudience } from 'src/common/enum/base';

export class PostDto {
  @IsNotEmpty()
  content: string;

  @IsOptional()
  cityCode: number;

  @IsOptional()
  feeling: EPostFeeling;

  @IsNotEmpty()
  audience: EAudience;

  @IsNotEmpty()
  userId: string;
}

export class PostTagDto {
  @IsNotEmpty()
  @IsArray()
  userIds: string[];

  @IsNotEmpty()
  postId: string;
}
