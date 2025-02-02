import { GatewayTimeoutException, HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class GlobalService {
  async connection() {
    try {
      return { message: 'Server connected' };
    } catch (error) {
      if (error instanceof GatewayTimeoutException)
        throw new HttpException('Timeout request', HttpStatus.GATEWAY_TIMEOUT);
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
