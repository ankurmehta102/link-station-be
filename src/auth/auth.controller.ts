import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from '../decorators/public.decorator';
import { User } from '../users/entities/user.entity';
import { SetCookieInterceptor } from '../interceptor/set-cookie.interceptor';

type LoginResponse = {
  user: User;
  accessToken: string;
};
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseInterceptors(SetCookieInterceptor)
  login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return this.authService.login(loginUserDto);
  }
}
