import { Module } from '@nestjs/common';
import { SubcategoriesService } from './services/subcategories.service';
import { SubcategoriesController } from './controllers/subcategories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from '../../common/entities/subcategory.entity';
import { Category } from '../../common/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Subcategory])],
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService],
})
export class SubcategoriesModule {}
