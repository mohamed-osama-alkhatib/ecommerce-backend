import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
// services
import { CategoriesService } from '../services/categories.service';
// dto
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
// guards
import { AuthGuard } from '../../../common/guards/jwt-auth.guard';
// decorators
import { Roles } from '../../../common/decorators/roles.decorator';
import { FindCategoriesDto } from '../dto/find-categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // =========================================================
  // @Docs admin & employee can create category
  // @Route POST category
  // @Accuss private "admin & employee"
  // =========================================================
  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin', 'employee'])
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(createCategoryDto);
  }

  // =========================================================
  // @Docs admin can get all categories
  // @Route GET categories
  // @Accuss public
  // =========================================================
  @Get()
  findAll(@Query() query: FindCategoriesDto) {
    return this.categoriesService.findAll(query);
  }

  // =========================================================
  // @Docs admin & employee can get category
  // @Route GET one category/id
  // @Accuss public
  // =========================================================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  // =========================================================
  // @Docs admin & employee can update category
  // @Route PATCH category/id
  // @Accuss private "admin & employee"
  // =========================================================
  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin', 'employee'])
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // =========================================================
  // @Docs admin can delete category
  // @Route DELETE category/id
  // @Accuss private "admin"
  // =========================================================
  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
