import { PickType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';

export class UpdateEmailDto extends PickType(BaseUserDto, ['email'] as const) {}
