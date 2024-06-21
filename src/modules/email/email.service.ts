import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmailContactDto, EmailOrderDto } from './email.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { ELang } from 'src/common/enum/base';
import { EmailHelper } from './email.helper';

@Injectable()
export class EmailService {
  constructor(private emailHelper: EmailHelper) {}

  async emailOrder(query: QueryDto, data: EmailOrderDto) {
    const { langCode } = query;
    const { email } = data;

    const subject =
      langCode === ELang.EN ? 'Order information' : 'Thông tin đơn hàng';
    await this.emailHelper.sendGmail({
      to: email,
      subject,
      html: '',
    });
    throw new HttpException('Email has been sent', HttpStatus.OK);
  }
}
