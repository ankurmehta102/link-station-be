import { PickType } from '@nestjs/mapped-types';
import { CreateLinkDto } from './create-link.dto';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateLinkDto extends PickType(CreateLinkDto, ['linkUrl']) {
  @ValidateIf((object, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  linkName?: string;
}
