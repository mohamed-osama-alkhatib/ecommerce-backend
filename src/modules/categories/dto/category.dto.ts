import { IsString, IsUrl, Length } from 'class-validator';

export class CategoryDto {
  @IsString({ message: 'Name must be a string' })
  @Length(1, 50, { message: 'Name must be between 1 and 50 characters' })
  name!: string;

  @IsUrl({}, { message: 'Image must be a valid URL' })
  @Length(0, 255, { message: 'Image must be between 0 and 255 characters' })
  image!: string;

  @IsString({ message: 'Description must be a string' })
  @Length(0, 500, {
    message: 'Description must be between 0 and 500 characters',
  })
  description?: string;
}
