import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from '../decorators/public.decorator';
import { User } from '../users/entities/user.entity';

type LoginResponse = {
  user: User;
  access_token: string;
};
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return this.authService.login(loginUserDto);
  }
}
