import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Public } from '../decorators/public.decorator';
import { OwnershipGuard } from '../guards/ownershipGuard.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
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

  @UseGuards(OwnershipGuard)
  @Get('profile/:userId')
  getUserProfile(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.getUserProfile(userId);
  }

  @Delete(':userId')
  @UseGuards(OwnershipGuard)
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.deleteUser(userId);
  }
}
