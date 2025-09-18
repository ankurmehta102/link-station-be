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
import { plainToInstance } from 'class-transformer';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { BaseUserDto } from './dto/base-user.dto';
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
      const savedUser = await this.usersRepo.save(newUser);

      return plainToInstance(BaseUserDto, savedUser, {
        excludeExtraneousValues: true,
      });
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
      const savedUser = await this.usersRepo.save(usersFound[0]);
      return plainToInstance(BaseUserDto, savedUser, {
        excludeExtraneousValues: true,
      });
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
      const savedUser = await this.usersRepo.save(usersFound[0]);
      return plainToInstance(BaseUserDto, savedUser, {
        excludeExtraneousValues: true,
      });
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
      const savedUser = await this.usersRepo.save(user);

      return plainToInstance(BaseUserDto, savedUser, {
        excludeExtraneousValues: true,
      });
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

      return plainToInstance(BaseUserDto, user, {
        excludeExtraneousValues: true,
      });
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

      await this.usersRepo.remove(user);
      return 'User deleted';
    } catch (err) {
      console.log('[deleteUser] err--->', err);
      throw err;
    }
  }

  async findUserByEmail(email: string) {
    return this.usersRepo.findOneBy({ email });
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

        // Delete the previous profile picture in cloudinary
        // if it exists (skipped on first upload)
        if (user.profilePicturePublicId) {
          try {
            const res = await this.cloudinaryService.deleteAsset(
              user.profilePicturePublicId,
            );
            res.result !== 'ok' &&
              console.log('[deleteAsset] failed --->', {
                publicId: user.profilePicturePublicId,
                res,
              });
          } catch (err) {
            console.log('[deleteAsset] err --->', {
              publicId: user.profilePicturePublicId,
              err,
            });
          }
        }

        user.profilePictureUrl = imageInfo.secure_url;
        user.profilePicturePublicId = imageInfo.public_id;
      }

      const savedUser = await this.usersRepo.save(user);
      return plainToInstance(BaseUserDto, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      console.log('[updateProfile] err--->', err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message);
    }
  }
}
