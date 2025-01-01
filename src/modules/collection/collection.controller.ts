import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { CollectionDto } from './collection.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('api/collection')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Get('list')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getCollections(@QueryPaging() query: QueryDto) {
    return this.collectionService.getCollections(query);
  }

  @Get('detail')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getCollection(@Query() query: QueryDto) {
    return this.collectionService.getCollection(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createCollection(@Body() collection: CollectionDto) {
    return this.collectionService.createCollection(collection);
  }

  @Post('createItem')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  createCollectionItem(@Query() query: QueryDto, @Body() collection: CollectionDto) {
    return this.collectionService.createCollectionItem(query, collection);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateCollection(@Query() query: QueryDto, @Body() collection: CollectionDto) {
    return this.collectionService.updateCollection(query, collection);
  }

  @Delete('remove')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeCollections(@Query() query: QueryDto) {
    return this.collectionService.removeCollections(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeCollectionPermanent(@Query() query: QueryDto) {
    return this.collectionService.removeCollectionsPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreCollections() {
    return this.collectionService.restoreCollections();
  }
}
