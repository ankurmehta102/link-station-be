import { Body, Controller, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch('username')
  updateUsername(@Body() updateUsernameDto: UpdateUsernameDto) {
    console.log('running--->');
    return this.usersService.updateUsername(updateUsernameDto);
  }
}
