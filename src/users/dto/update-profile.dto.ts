import { PickType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto extends PickType(BaseUserDto, [
  'lastName',
] as const) {
  // Using ValidateIf instead of IsOptional, because IsOptional allows null.
  // This makes the field optional.
  @ValidateIf((object, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  firstName?: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsOptional()
  @IsString()
  @IsEmail()
  @MaxLength(50)
  displayEmail?: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsOptional()
  @IsString()
  @MaxLength(150)
  bio?: string;
}
