import { Body, Controller, Patch, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch('username')
  updateUsername(@Body() updateUsernameDto: UpdateUsernameDto) {
    return this.usersService.updateUsername(updateUsernameDto);
  }

  @Patch('email')
  updateEmail(@Body() updateEmailDto: UpdateEmailDto) {
    return this.usersService.updateEmail(updateEmailDto);
  }

  @Patch('password')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.usersService.updatePassword(updatePasswordDto);
  }
}
