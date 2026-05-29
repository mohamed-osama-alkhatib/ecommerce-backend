import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-subcategory.dto';
import { Subcategory } from '../../../common/entities/subcategory.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../../common/entities/category.entity';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================
  async create(createSubcategoryDto: CreateSubcategoryDto) {
    // name unique check
    const ifSubcategoryExist = await this.subcategoryRepository.findOne({
      where: { name: createSubcategoryDto.name },
    });
    if (ifSubcategoryExist) {
      throw new HttpException('Subcategory already exist', 400);
    }

    const { category, ...rest } = createSubcategoryDto;

    // check Category
    const isCategory = await this.categoryRepository.findOne({
      where: { id: category },
    });
    if (!isCategory) {
      throw new NotFoundException('Category not found');
    }

    const subcategoryInstance = this.subcategoryRepository.create({
      ...rest,
      category: isCategory,
    });

    const createdSubcategory =
      await this.subcategoryRepository.save(subcategoryInstance);

    return {
      status: 201,
      message: 'Subcategory created successfully',
      data: createdSubcategory,
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

    const qb =
      await this.subcategoryRepository.createQueryBuilder('subcategory');

    // ========================
    // SEARCH
    // ========================
    // example:
    // ?search=اس

    if (search) {
      qb.andWhere(
        `
      (
        subcategory.name ILIKE :search
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

    qb.orderBy(`subcategory.${finalSort}`, finalOrder);

    // ========================
    // EXECUTE
    // ========================

    const [subcategory, total] = await qb.getManyAndCount();

    return {
      status: 200,
      message: 'Subcategory retrieved successfully',
      count: total,
      filters: search,
      data: subcategory,
    };
  }

  // =========================================================
  // FIND ONE
  // =========================================================
  async findOne(id: string) {
    // check subcategory exist
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
    });

    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    return {
      status: 200,
      message: 'Subcategory found successfully',
      data: subcategory,
    };
  }

  // =========================================================
  // UPDATE
  // =========================================================
  async update(id: string, updatesubcategoryDto: UpdateSubcategoryDto) {
    // check subcategory exist
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
    });

    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    const { category, ...rest } = updatesubcategoryDto;

    const updateData: any = { ...rest };

    if (category) {
      const isCategoryExist = await this.categoryRepository.findOne({
        where: { id: category },
      });
      if (!isCategoryExist) {
        throw new NotFoundException('Selected Category not found');
      }

      updateData.category = { id: category };
    }

    await this.subcategoryRepository.update(id, updateData);

    const updatedSubcategory = await this.subcategoryRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    return {
      status: 200,
      message: 'Subcategory updated successfully',
      data: updatedSubcategory,
    };
  }

  // =========================================================
  // DELETE
  // =========================================================
  async remove(id: string) {
    // check subcategory exist
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
    });

    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    await this.subcategoryRepository.remove(subcategory);
    return {
      status: 200,
      message: 'Subcategory removed successfully',
    };
  }
}
