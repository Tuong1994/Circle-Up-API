import { Controller } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('api/follow')
export class FollowController {
  constructor(private followService: FollowService) {}
}
