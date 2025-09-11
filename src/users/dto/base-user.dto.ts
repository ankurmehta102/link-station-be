import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BaseUserDto {
  @IsNumber()
  @Expose()
  userId: number;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  @Expose()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Expose()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Expose()
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Expose()
  lastName?: string;

  @Expose()
  displayEmail: string;

  @Expose()
  bio: string;

  @Expose()
  profilePictureUrl: string;

  @Expose()
  userRole: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
