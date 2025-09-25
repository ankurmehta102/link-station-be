import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { ImageFileValidator } from '../validators/image-file.validator';
import { OwnershipGuard } from '../guards/ownership.guard';
import { Link } from './entities/link.entity';
import { UpdateLinkDto } from './dto/update-link.dto';

@Controller('users/:userId/links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @UseGuards(OwnershipGuard)
  @UseInterceptors(FileInterceptor('linkImage'))
  @Post()
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createLinkDto: CreateLinkDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new ImageFileValidator({
            maxSize: 2 * 1024 * 1024,
            fileType: /^image\/(jpeg|png)$/,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    linkImage?: Express.Multer.File,
  ): Promise<Link> {
    return this.linksService.create(userId, createLinkDto, linkImage);
  }

  @UseGuards(OwnershipGuard)
  @Get()
  getAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.linksService.getAll(userId);
  }

  @UseGuards(OwnershipGuard)
  @UseInterceptors(FileInterceptor('linkImage'))
  @Patch(':linkId')
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('linkId', ParseIntPipe) linkId: number,
    @Body() updateLinkDto: UpdateLinkDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new ImageFileValidator({
            maxSize: 2 * 1024 * 1024,
            fileType: /^image\/(jpeg|png)$/,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    linkImage?: Express.Multer.File,
  ): Promise<Link> {
    return this.linksService.update(userId, linkId, updateLinkDto, linkImage);
  }
}
