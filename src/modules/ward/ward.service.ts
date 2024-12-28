import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Ward } from '@prisma/client';
import { WardDto } from './ward.dto';
import { WardHelper } from './ward.helper';
import { ELang } from 'src/common/enum/base';
import utils from 'src/utils';

@Injectable()
export class WardService {
  constructor(
    private prisma: PrismaService,
    private wardHelper: WardHelper,
  ) {}

  private isNotDelete = { isDelete: { equals: false } };

  async getWards(query: QueryDto) {
    const { keywords, sortBy, langCode, districtCode } = query;
    const wards = await this.prisma.ward.findMany({
      where: {
        AND: [{ districtCode: districtCode && Number(districtCode) }, { ...this.isNotDelete }],
      },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.wardHelper.getSelectFields(langCode) },
    });
    let filterWards: Ward[] = [];
    if (keywords)
      filterWards = wards.filter((ward) =>
        langCode === ELang.EN
          ? utils.filterByKeywords(ward.nameEn, keywords)
          : utils.filterByKeywords(ward.nameVn, keywords),
      );
    const items = this.wardHelper.convertCollection(keywords ? filterWards : wards, langCode);
    return { totalItems: keywords ? filterWards.length : wards.length, items };
  }

  async getWardsPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode, districtCode } = query;
    let collection: Paging<Ward> = utils.defaultCollection();
    const wards = await this.prisma.ward.findMany({
      where: {
        AND: [{ districtCode: districtCode && Number(districtCode) }, { ...this.isNotDelete }],
      },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.wardHelper.getSelectFields(langCode) },
    });
    if (keywords) {
      const filterWards = wards.filter((ward) =>
        langCode === ELang.EN
          ? utils.filterByKeywords(ward.nameEn, keywords)
          : utils.filterByKeywords(ward.nameVn, keywords),
      );
      collection = utils.paging<Ward>(filterWards, page, limit);
    } else collection = utils.paging<Ward>(wards, page, limit);
    const items = this.wardHelper.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getWard(query: QueryDto) {
    const { wardId, langCode } = query;
    const ward = await this.prisma.ward.findUnique({
      where: { id: wardId, ...this.isNotDelete },
      select: { ...this.wardHelper.getSelectFields(langCode) },
    });
    if (!ward) throw new HttpException('Ward not found', HttpStatus.NOT_FOUND);
    return utils.convertRecordsName<Ward>(ward, langCode);
  }

  async createWard(ward: WardDto) {
    const { nameEn, nameVn, code, districtCode } = ward;
    const newWard = await this.prisma.ward.create({
      data: { nameEn, nameVn, code, districtCode, isDelete: false },
    });
    return newWard;
  }

  async updateWard(query: QueryDto, ward: WardDto) {
    const { wardId } = query;
    const { nameEn, nameVn, code, districtCode } = ward;
    await this.prisma.ward.update({
      where: { id: wardId },
      data: { nameEn, nameVn, code, districtCode },
    });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeWards(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const wards = await this.prisma.ward.findMany({ where: { id: { in: listIds } } });
    if (wards && !wards.length) throw new HttpException('Ward not found', HttpStatus.NOT_FOUND);
    await this.prisma.ward.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removeWardsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const wards = await this.prisma.ward.findMany({ where: { id: { in: listIds } } });
    if (wards && !wards.length) throw new HttpException('Ward not found', HttpStatus.NOT_FOUND);
    await this.prisma.ward.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restoreWards() {
    const wards = await this.prisma.ward.findMany({ where: { isDelete: { equals: true } } });
    if (wards && !wards.length) throw new HttpException('There are no data to restored', HttpStatus.OK);
    await Promise.all(
      wards.map(async (ward) => {
        await this.prisma.ward.update({ where: { id: ward.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
