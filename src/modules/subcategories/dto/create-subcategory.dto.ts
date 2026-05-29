import { PartialType } from '@nestjs/mapped-types';
import { SubcategoryDto } from './subcategory.dto';

export class CreateSubcategoryDto extends PartialType(SubcategoryDto) {
  name!: string;
  image!: string;
  description?: string;
  category!: string;
}
