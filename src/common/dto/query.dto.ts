import { ELang, EMediaType, ERole } from '../enum/base';

export class QueryDto {
  page?: string;
  limit?: string;
  keywords?: string;
  sortBy?: number;

  ids?: string;
  userId?: string;
  userInfoId?: string;
  userWorkId?: string;
  userEducationId?: string;
  userLivedId?: string;
  postId?: string;
  eventId?: string;
  followId?: string;
  followedId?: string;
  followerId?: string;
  commentId?: string;
  likeId?: string;
  mediaId?: string;
  cityId?: string;
  districtId?: string;
  wardId?: string;
  cityCode?: number;
  districtCode?: number;

  hasLike?: boolean;
  staffOnly?: boolean;
  convertLang?: boolean;
  admin?: boolean;
  video?: boolean;

  role?: ERole;
  langCode?: ELang;
  fileType?: EMediaType;
}
