import { PartialType } from '@nestjs/mapped-types';
import { CreateTastingDto } from './create-tasting.dto';

export class UpdateTastingDto extends PartialType(CreateTastingDto) {}
