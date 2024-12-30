import { IsNotEmpty } from 'class-validator';
import { EFriendStatus } from './friend.enum';

export class FriendDto {
  @IsNotEmpty()
  status: EFriendStatus;

  @IsNotEmpty()
  requesterId: string;

  @IsNotEmpty()
  receiverId: string;
}
