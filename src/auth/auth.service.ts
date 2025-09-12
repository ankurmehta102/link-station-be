import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { plainToInstance } from 'class-transformer';

import { BaseUserDto } from '../users/dto/base-user.dto';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;

      const user = await this.usersService.findUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User does not exist.');
      }

      const isPasswordMatched = await compare(password, user.passwordHash);
      if (!isPasswordMatched) {
        throw new BadRequestException('Password is incorrect');
      }

      const jwtPayload = { sub: user.userId, username: user.username };

      return {
        user: plainToInstance(BaseUserDto, user, {
          excludeExtraneousValues: true,
        }),
        access_token: await this.jwtService.signAsync(jwtPayload),
      };
    } catch (err) {
      console.log('[login] err--->', err);
      throw err;
    }
  }
}
