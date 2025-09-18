import { PartialType, PickType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';

export class UpdateProfileDto extends PartialType(
  PickType(BaseUserDto, [
    'bio',
    'displayEmail',
    'firstName',
    'lastName',
  ] as const),
) {}
