import { IsNotEmpty, IsString, IsUrl, IsUUID, Length } from 'class-validator';

export class SubcategoryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(1, 50, { message: 'Name must be between 1 and 50 characters' })
  name!: string;

  @IsUrl({}, { message: 'Image must be a valid URL' })
  @IsNotEmpty({ message: 'Image is required' })
  @Length(0, 255, { message: 'Image must be between 0 and 255 characters' })
  image!: string;

  @IsString({ message: 'Description must be a string' })
  @Length(0, 500, {
    message: 'Description must be between 0 and 500 characters',
  })
  description?: string;

  @IsUUID('4', { message: 'Category must be a valid UUID' })
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsString({ message: 'Category must be a string' })
  category!: string;
}
