import { PickType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';

export class UpdatePasswordDto extends PickType(BaseUserDto, [
  'userId',
  'password',
]) {}
