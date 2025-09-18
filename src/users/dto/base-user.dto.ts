import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
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

  @IsString()
  @ValidateIf((o) => o.displayEmail !== '')
  @IsEmail()
  @MaxLength(50)
  @Expose()
  displayEmail: string;

  @IsString()
  @MaxLength(150)
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
