import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { QueryDto } from 'src/common/dto/query.dto';
import { ELang } from 'src/common/enum/base';
import { EmailHelper } from './email.helper';

@Injectable()
export class EmailService {
  constructor(private emailHelper: EmailHelper) {}
}
