import { EFriendStatus } from './friend.enum';

export type FriendStatus =
  | EFriendStatus.PENDING
  | EFriendStatus.ACCEPTED
  | EFriendStatus.REJECTED
  | EFriendStatus.BLOCKED
  | EFriendStatus.REMOVED;
