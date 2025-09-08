import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UpdateUsernameDto } from './dto/update-username.dto';

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
        throw new ConflictException('Username is already in use');
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
      console.log('[create] err-->', err);
      throw err;
    }
  }

  async updateUsername(updateUsernameDto: UpdateUsernameDto) {
    try {
      const { userId, username } = updateUsernameDto;
      const users = await this.usersRepo.find({
        where: [{ userId }, { username }],
      });

      if (!users.length || (users.length === 1 && users[0].userId !== userId)) {
        throw new NotFoundException('User does not exist');
      }
      if (users.length > 1) {
        throw new ConflictException('Username is already in use');
      }

      users[0].username = username;
      const savedUser = await this.usersRepo.save(users[0]);
      return plainToInstance(User, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      console.log('[updateUsername] err--->');
      throw err;
    }
  }
}
