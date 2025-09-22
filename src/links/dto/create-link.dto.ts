import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  @IsNotEmpty()
  linkName: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsString()
  @IsOptional()
  linkUrl: string;
}
