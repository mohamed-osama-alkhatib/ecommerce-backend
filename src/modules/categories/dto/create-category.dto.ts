import { PartialType } from '@nestjs/mapped-types';
import { CategoryDto } from './category.dto';

export class CreateCategoryDto extends PartialType(CategoryDto) {
  name!: string;
  image!: string;
  description?: string;
}
