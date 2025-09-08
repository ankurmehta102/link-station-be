import { PickType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';

export class UpdateEmailDto extends PickType(BaseUserDto, [
  'userId',
  'email',
] as const) {}
