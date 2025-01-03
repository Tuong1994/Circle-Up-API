import * as bcryptjs from 'bcryptjs';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { Media, Prisma } from '@prisma/client';
import { UploadApiResponse } from 'cloudinary';
import { ELang, EMediaType, ESort } from '../common/enum/base';
import { Lang, en, vn } from '../common/lang';

type FileExtraData = {
  hash: string;
  type: EMediaType;
  userId?: string;
  postId?: string;
  albumId?: string;
};

const utils = {
  bcryptHash: (secret: string) => {
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(secret, salt);
    return hash;
  },

  paging: <M>(records: M[], pageParam: string, limitParam: string) => {
    const page = Number(pageParam);
    const limit = Number(limitParam);
    const totalItems = records.length;

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = records.slice(start, end);

    return { totalItems, page, limit, items };
  },

  defaultCollection: () => {
    return { totalItems: 0, page: 0, limit: 0, items: [] };
  },

  defaultList: () => {
    return { totalItems: 0, items: [] };
  },

  generateFileHash(file: Express.Multer.File): string {
    const hash = crypto.createHash('sha256');
    hash.update(file.buffer);
    return hash.digest('hex'); // Returns the file hash as a string
  },

  generateFile: (result: UploadApiResponse, extraData: FileExtraData) => {
    const defaultProps: Pick<Media, 'path' | 'size' | 'publicId'> = {
      path: '',
      size: 0,
      publicId: '',
    };
    return {
      ...defaultProps,
      ...extraData,
      path: result.secure_url,
      size: result.bytes,
      publicId: result.public_id,
    };
  },

  getFileUrl: (file: Express.Multer.File) => {
    const b64 = Buffer.from(file.buffer).toString('base64');
    let dataURL = 'data:' + file.mimetype + ';base64,' + b64;
    return dataURL;
  },

  getSortBy: (sort: number): Prisma.SortOrder => {
    const sorts: Record<number, string> = {
      [ESort.NEWEST]: 'desc',
      [ESort.OLDEST]: 'asc',
      [ESort.PRICE_GO_UP]: 'asc',
      [ESort.PRICE_GO_DOWN]: 'desc',
    };
    return sorts[sort] as Prisma.SortOrder;
  },

  getLang: (langCode: ELang): Lang => {
    if (langCode === ELang.EN) return en;
    return vn;
  },

  removeFile: (path: string, message = 'Filed is deleted') => {
    if (!path) return;
    return fs.unlink(path, (error) => {
      if (error) throw error;
      console.log(message);
    });
  },

  parseJSON: <M>(json: string): M => {
    if (!json) return;
    const parse = JSON.parse(json);
    return parse;
  },

  formatPhoneNumber: (phone: string) => {
    let telFormat = '(xxx) xxxx xxxx';
    let mobileFormat = '(xxx) xxx xxxx';
    const telNumberLength = 11;
    const mobileNumberLength = 10;

    if (phone.length !== telNumberLength && phone.length !== mobileNumberLength)
      return 'Invalid phone number';

    for (let i = 0; i < phone.length; i++) {
      telFormat = telFormat.replace('x', phone[i]);
      mobileFormat = mobileFormat.replace('x', phone[i]);
    }

    if (phone.length === telNumberLength) return telFormat;
    return mobileFormat;
  },

  convertRecordsName: <M>(record: M, langCode: ELang) => {
    if (!record) return null;
    const recordClone = { ...record };
    delete record['nameEn'];
    delete record['nameVn'];
    const data = { name: langCode === ELang.EN ? recordClone['nameEn'] : recordClone['nameVn'], ...record };
    return data;
  },

  filterByKeywords: (value: string, keywords: string) => {
    return value.toLowerCase().includes(keywords.toLowerCase());
  },
};

export default utils;
