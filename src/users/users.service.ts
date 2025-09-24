import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password, username } = createUserDto;

      const existingUser = await this.usersRepo.findOne({
        where: [{ email }, { username }],
      });

      if (existingUser?.email === email) {
        throw new ConflictException('Email is already in use');
      }
      if (existingUser?.username === username) {
        throw new ConflictException('Username is already in use');
      }

      const passwordHash = await hash(password, 10);

      const newUser = this.usersRepo.create({
        passwordHash,
        ...createUserDto,
      });
      return await this.usersRepo.save(newUser);
    } catch (err) {
      console.log('[create] err-->', err);
      throw err;
    }
  }

  async updateUsername(userId: number, username: string) {
    try {
      const usersFound = await this.usersRepo.find({
        where: [{ userId }, { username }],
      });

      if (
        !usersFound.length ||
        (usersFound.length === 1 && usersFound[0].userId !== userId)
      ) {
        throw new NotFoundException('User does not exist');
      }
      if (usersFound.length > 1) {
        throw new ConflictException('Username is already in use');
      }

      usersFound[0].username = username;
      return this.usersRepo.save(usersFound[0]);
    } catch (err) {
      console.log('[updateUsername] err--->', err);
      throw err;
    }
  }

  async updateEmail(userId: number, email: string) {
    try {
      const usersFound = await this.usersRepo.find({
        where: [{ userId }, { email }],
      });

      if (
        !usersFound.length ||
        (usersFound.length === 1 && usersFound[0].userId !== userId) // true only if user record found by email.
      ) {
        throw new NotFoundException('User does not exist');
      }
      if (usersFound.length > 1) {
        throw new ConflictException('Email is already in use');
      }

      usersFound[0].email = email;
      return this.usersRepo.save(usersFound[0]);
    } catch (err) {
      console.log('[updateEmail] err--->', err);
      throw err;
    }
  }

  async updatePassword(userId: number, password: string) {
    try {
      const user = await this.usersRepo.findOneBy({ userId });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      const passwordHash = await hash(password, 10);

      user.passwordHash = passwordHash;
      return this.usersRepo.save(user);
    } catch (err) {
      console.log('[updatePassword] err--->', err);
      throw err;
    }
  }

  async getUserProfile(userId: number) {
    try {
      const user = await this.usersRepo.findOneBy({ userId });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      return user;
    } catch (err) {
      console.log('[getUserProfile] err--->', err);
      throw err;
    }
  }

  async deleteUser(userId: number) {
    try {
      const user = await this.usersRepo.findOneBy({ userId });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      // Delete profile picture in Cloudinary if it exists.
      user.profilePicturePublicId &&
        this.cloudinaryService.deleteAsset(user.profilePicturePublicId);

      return this.usersRepo.remove(user);
    } catch (err) {
      console.log('[deleteUser] err--->', err);
      throw err;
    }
  }

  async findUserByEmail(email: string) {
    return this.usersRepo.findOneBy({ email });
  }

  async findUserWithLinks(userId: number) {
    return this.usersRepo.findOne({
      where: { userId },
      relations: ['links'],
    });
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
    profilePicture?: Express.Multer.File,
  ) {
    try {
      const user = await this.usersRepo.preload({
        userId,
        ...updateProfileDto,
      });
      if (!user) throw new NotFoundException('User does not exist');

      if (profilePicture) {
        const imageInfo =
          await this.cloudinaryService.uploadFile(profilePicture);

        // Delete old profile picture from Cloudinary (if it exists)
        user.profilePicturePublicId &&
          this.cloudinaryService.deleteAsset(user.profilePicturePublicId);

        user.profilePictureUrl = imageInfo.secure_url;
        user.profilePicturePublicId = imageInfo.public_id;
      }

      return this.usersRepo.save(user);
    } catch (err) {
      console.log('[updateProfile] err--->', err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
