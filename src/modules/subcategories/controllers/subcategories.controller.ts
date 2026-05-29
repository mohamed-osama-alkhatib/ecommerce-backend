import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { SubcategoriesService } from '../services/subcategories.service';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-subcategory.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AuthGuard } from '../../../common/guards/jwt-auth.guard';
import { FindSubcategoriesDto } from '../dto/find-subcategories.dto';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

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
    createSubcategoryDto: CreateSubcategoryDto,
  ) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  @Get()
  findAll(@Query() query: FindSubcategoriesDto) {
    return this.subcategoriesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.update(id, updateSubcategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(id);
  }
}
