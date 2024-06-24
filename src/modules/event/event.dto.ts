import { IsNotEmpty, IsOptional } from 'class-validator';

export class EventDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  creatorId: string;
}
