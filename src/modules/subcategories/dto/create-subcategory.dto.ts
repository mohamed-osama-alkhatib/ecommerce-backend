import { PartialType } from '@nestjs/mapped-types';
import { SubcategoryDto } from './subcategory.dto';
import { Category } from '../../../common/entities/category.entity';

export class CreateSubcategoryDto extends PartialType(SubcategoryDto) {
  name!: string;
  image!: string;
  description?: string;
  category!: Category;
}
