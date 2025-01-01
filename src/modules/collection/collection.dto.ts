import { Optional } from '@nestjs/common';
import { IsOptional } from 'class-validator';

export class CollectionDto {
  @Optional()
  name: string;

  @Optional()
  userId: string;

  @IsOptional()
  postId: string;
}
