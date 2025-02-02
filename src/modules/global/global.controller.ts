import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { GlobalService } from './global.service';

@Controller('api/global')
export class GlobalController {
  constructor(private globalService: GlobalService) {}

  @Get('connection')
  @HttpCode(HttpStatus.OK)
  connection() {
    return this.globalService.connection();
  }
}
