import { IsOptional } from 'class-validator';

export class FollowDto {
  @IsOptional()
  followerId: string;

  @IsOptional()
  followedId: string;

  @IsOptional()
  postId: string;
}
