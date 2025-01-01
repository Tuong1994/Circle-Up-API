import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { EAudience } from 'src/common/enum/base';

export class AlbumTagDto {
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  albumId: string;
}

export class AlbumDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  audience: EAudience;

  @IsNotEmpty()
  authorId: string;

  @IsOptional()
  postId: string;

  @IsOptional()
  description: string;

  @IsOptional()
  cityCode: number;

  @IsOptional()
  feeling: number;

  @IsOptional()
  @IsArray()
  tags: AlbumTagDto[];
}
