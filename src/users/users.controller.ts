import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Public } from '../decorators/public.decorator';
import { OwnershipGuard } from '../guards/ownership.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ImageFileValidator } from '../validators/image-file.validator';
import { User } from './entities/user.entity';

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
  ): Promise<User> {
    return this.usersService.updateUsername(userId, updateUsernameDto.username);
  }

  @UseGuards(OwnershipGuard)
  @Patch('email/:userId')
  updateEmail(
    @Body() updateEmailDto: UpdateEmailDto,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<User> {
    return this.usersService.updateEmail(userId, updateEmailDto.email);
  }

  @UseGuards(OwnershipGuard)
  @Patch('password/:userId')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<User> {
    return this.usersService.updatePassword(userId, updatePasswordDto.password);
  }

  @UseGuards(OwnershipGuard)
  @Get('profile/:userId')
  getUserProfile(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    return this.usersService.getUserProfile(userId);
  }

  @UseGuards(OwnershipGuard)
  @Delete(':userId')
  deleteUser(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    return this.usersService.deleteUser(userId);
  }

  @UseGuards(OwnershipGuard)
  @UseInterceptors(FileInterceptor('profilePicture'))
  @Patch('/profile/:userId')
  updateProfile(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new ImageFileValidator({
            maxSize: 2 * 1024 * 1024,
            fileType: /^image\/(jpeg|png)$/,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    profilePicture?: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.updateProfile(
      userId,
      updateProfileDto,
      profilePicture,
    );
  }
}
