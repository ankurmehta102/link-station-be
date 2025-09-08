import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
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

      return plainToInstance(User, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      console.log('[create] err-->', err);
      throw err;
    }
  }

  async updateUsername(updateUsernameDto: UpdateUsernameDto) {
    try {
      const { userId, username } = updateUsernameDto;
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
      return plainToInstance(User, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      console.log('[updateUsername] err--->', err);
      throw err;
    }
  }

  async updateEmail(updateEmailDto: UpdateEmailDto) {
    try {
      const { userId, email } = updateEmailDto;
      const usersFound = await this.usersRepo.find({
        where: [{ userId }, { email }],
      });

      if (
        !usersFound.length ||
        (usersFound.length === 1 && usersFound[0].userId !== userId)
      ) {
        throw new NotFoundException('User does not exist');
      }
      if (usersFound.length > 1) {
        throw new ConflictException('Email is already in use');
      }

      usersFound[0].email = email;
      const savedUser = await this.usersRepo.save(usersFound[0]);
      return plainToInstance(User, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      console.log('[updateEmail] err--->', err);
      throw err;
    }
  }
}
