import { Injectable } from '@nestjs/common';
import { ELang } from '../../common/enum/base';
import { Prisma, Ward } from '@prisma/client';
import utils from '../../utils';

@Injectable()
export class WardHelper {
  getSelectFields(langCode: ELang): Prisma.WardSelect {
    return {
      id: true,
      nameEn: langCode === ELang.EN,
      nameVn: langCode === ELang.VN,
      code: true,
      districtCode: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  convertCollection(wards: Ward[], langCode: ELang) {
    return wards.map((ward) => ({
      ...utils.convertRecordsName<Ward>(ward, langCode),
    }));
  }
}
