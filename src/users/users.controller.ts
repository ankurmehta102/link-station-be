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

  @UseGuards(OwnershipGuard)
  @Patch('username/:userId')
  updateUsername(
    @Body() updateUsernameDto: UpdateUsernameDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.usersService.updateUsername(userId, updateUsernameDto.username);
  }

  @UseGuards(OwnershipGuard)
  @Patch('email/:userId')
  updateEmail(
    @Body() updateEmailDto: UpdateEmailDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.usersService.updateEmail(userId, updateEmailDto.email);
  }

  @UseGuards(OwnershipGuard)
  @Patch('password/:userId')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.usersService.updatePassword(userId, updatePasswordDto.password);
  }

  @UseGuards(OwnershipGuard)
  @Get('profile/:userId')
  getUserProfile(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.getUserProfile(userId);
  }

  @UseGuards(OwnershipGuard)
  @Delete(':userId')
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.deleteUser(userId);
  }
}
