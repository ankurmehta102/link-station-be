import {
  Body,
  Controller,
  Param,
  ParseFilePipe,
  ParseIntPipe,
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
}
