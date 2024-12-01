import { Body, Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('api/email')
export class EmailController {
  constructor(private emailService: EmailService) {}
}
