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
  userId: number;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  lastName?: string;

  @IsString()
  @ValidateIf((o) => o.displayEmail !== '')
  @IsEmail()
  @MaxLength(50)
  displayEmail: string;

  @IsString()
  @MaxLength(150)
  bio: string;
}
