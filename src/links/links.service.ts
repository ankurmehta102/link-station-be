import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateLinkDto } from './dto/create-link.dto';
import { UsersService } from '../users/users.service';
import { Link } from './entities/link.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { getNextDisplayOrder } from '../helper/utils';
import { UpdateLinkDto } from './dto/update-link.dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linksRepo: Repository<Link>,
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(
    userId: number,
    createLinkDto: CreateLinkDto,
    linkImage?: Express.Multer.File,
  ) {
    try {
      const user = await this.usersService.findUserWithLinks(userId);
      if (!user) throw new NotFoundException('User does not exist');

      let imageInfo = {};
      if (linkImage) {
        const { secure_url: secureUrl, public_id: PublicId } =
          await this.cloudinaryService.uploadFile(linkImage);
        imageInfo = { linkImageUrl: secureUrl, linkImageProfileId: PublicId };
      }

      const newLink = this.linksRepo.create({
        userId,
        linkName: createLinkDto.linkName,
        displayOrder: getNextDisplayOrder(user.links),
        linkUrl: createLinkDto.linkUrl,
        ...imageInfo,
      });
      return this.linksRepo.save(newLink);
    } catch (err) {
      console.log('[LinksService/create] err--->', err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }

  async getAll(userId: number) {
    const user = await this.usersService.findUserWithLinks(userId);
    if (!user) throw new NotFoundException('User does not exist');
    return user.links;
  }

  async update(
    userId: number,
    linkId: number,
    updateLinkDto: UpdateLinkDto,
    linkImage?: Express.Multer.File,
  ) {
    try {
      const user = await this.usersService.findUserWithLinks(userId);
      if (!user) throw new NotFoundException('User does not exist');

      const link = user.links.find((element) => element.linkId === linkId);
      if (!link) throw new NotFoundException('Link does not exist');

      if (linkImage) {
        const imageInfo = await this.cloudinaryService.uploadFile(linkImage);

        // Delete old profile picture from Cloudinary (if it exists)
        link.linkImagePublicId &&
          this.cloudinaryService.deleteAsset(link.linkImagePublicId);

        link.linkImageUrl = imageInfo.secure_url;
        link.linkImagePublicId = imageInfo.public_id;
      }

      return this.linksRepo.save(Object.assign(link, updateLinkDto));
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.log('[LinksService/update] err--->', err);
      throw new InternalServerErrorException(err?.message);
    }
  }
}
