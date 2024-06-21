import { ELang, ERecordStatus, ERole } from '../enum/base';
import { EGender } from 'src/modules/user/user.enum';

export class QueryDto {
  page?: string;
  limit?: string;
  keywords?: string;
  sortBy?: number;

  ids?: string;
  userId?: string;
  postId?: string;
  eventId?: string;
  followId?: string;
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
  gender?: EGender;
  langCode?: ELang;
}
