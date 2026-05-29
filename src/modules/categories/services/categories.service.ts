import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../common/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================
  async create(createCategoryDto: CreateCategoryDto) {
    // name unique check
    const ifCategoryExist = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (ifCategoryExist) {
      throw new HttpException('Category already exist', 400);
    }

    const createdCategory =
      await this.categoryRepository.save(createCategoryDto);
    return {
      status: 201,
      message: 'Category created successfully',
      data: createdCategory,
    };
  }

  // =========================================================
  // FIND ALL
  // =========================================================
  async findAll(query) {
    const {
      // sorting
      sort = 'createdAt',
      order = 'ASC',
      // search
      search,
    } = query;

    const qb = await this.categoryRepository.createQueryBuilder('category');

    // ========================
    // SEARCH
    // ========================
    // example:
    // ?search=اس

    if (search) {
      qb.andWhere(
        `
      (
        category.name ILIKE :search
      )
      `,
        {
          search: `%${search}%`,
        },
      );
    }

    // ========================
    // SORTING
    // ========================

    const allowedSortFields = ['createdAt', 'name'];

    const finalSort = allowedSortFields.includes(sort) ? sort : 'createdAt';

    const finalOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    qb.orderBy(`category.${finalSort}`, finalOrder);

    // ========================
    // EXECUTE
    // ========================

    const [category, total] = await qb.getManyAndCount();

    return {
      status: 200,
      message: 'Category retrieved successfully',
      count: total,
      filters: search,
      data: category,
    };
  }

  // =========================================================
  // FIND ONE
  // =========================================================
  async findOne(id: string) {
    // check category exist
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      status: 200,
      message: 'Category found successfully',
      data: category,
    };
  }

  // =========================================================
  // UPDATE
  // =========================================================
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // check category exist
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updatedCategory = await this.categoryRepository.update(
      id,
      updateCategoryDto,
    );

    return {
      status: 200,
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  // =========================================================
  // DELETE
  // =========================================================
  async remove(id: string) {
    // check category exist
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.remove(category);
    return {
      status: 200,
      message: 'Category removed successfully',
    };
  }
}
