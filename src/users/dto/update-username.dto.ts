import { PickType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';

export class UpdateUsernameDto extends PickType(BaseUserDto, [
  'userId',
  'username',
] as const) {}
