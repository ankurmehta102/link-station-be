import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password, username } = createUserDto;

      const isUserExist = await this.usersRepo.findOne({
        where: [{ email }, { username }],
      });

      if (isUserExist?.email === email) {
        throw new ConflictException('Email is already in use');
      }
      if (isUserExist?.username === username) {
        throw new ConflictException('Username already exist');
      }

      const passwordHash = await hash(password, 10);

      const userInstance = this.usersRepo.create({
        passwordHash,
        ...createUserDto,
      });
      const savedUser = await this.usersRepo.save(userInstance);

      return plainToInstance(User, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      console.log('[create]-->', err);
      throw err;
    }
  }
}
