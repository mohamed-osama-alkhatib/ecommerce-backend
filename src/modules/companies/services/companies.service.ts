import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../../../common/entities/company.entity';
import { City } from '../../../common/entities/city.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================
  async create(createCompanyDto: CreateCompanyDto) {
    // name unique check
    const ifCompanyExist = await this.companyRepository.findOne({
      where: { name: createCompanyDto.name },
    });
    if (ifCompanyExist) {
      throw new HttpException('Company already exist', 400);
    }

    const citiesObjects = (createCompanyDto.servedCities?.map((code) => ({
      code,
    })) || []) as DeepPartial<City>[];
    const companyInstance = this.companyRepository.create({
      ...createCompanyDto,
      servedCities: citiesObjects,
    });
    const createdCompany = await this.companyRepository.save(companyInstance);

    return {
      status: 201,
      message: 'Company created successfully',
      data: createdCompany,
    };
  }

  // =========================================================
  // FIND ALL
  // =========================================================
  async findAll(query) {
    const { sort = 'joinedAt', order = 'ASC', search } = query;

    const qb = this.companyRepository.createQueryBuilder('company');

    // ========================
    // SEARCH
    // ========================
    if (search) {
      qb.andWhere(
        `
        (
          company.name ILIKE :search
          OR
          company.description ILIKE :search
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
    const allowedSortFields = ['joinedAt', 'name'];
    const finalSort = allowedSortFields.includes(sort) ? sort : 'joinedAt';
    const finalOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    qb.orderBy(`company.${finalSort}`, finalOrder);

    // ========================
    // EXECUTE
    // ========================
    const [companies, total] = await qb.getManyAndCount();

    return {
      status: 200,
      message: 'Companies retrieved successfully',
      count: total,
      filters: search,
      data: companies,
    };
  }

  // =========================================================
  // FIND ONE
  // =========================================================
  async findOne(id: string) {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return {
      status: 200,
      message: 'Company found successfully',
      data: company,
    };
  }

  // =========================================================
  // UPDATE
  // =========================================================
  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    // check company exist
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const { servedCities, ...restOfDto } = updateCompanyDto;

    let citiesObjects: any[] | undefined = undefined;
    if (servedCities) {
      citiesObjects = servedCities.map((code) => ({ code }));
    }

    const updatedCompany = await this.companyRepository.save({
      id: id,
      ...restOfDto,
      servedCities: citiesObjects,
    });

    return {
      status: 200,
      message: 'Company updated successfully',
      data: updatedCompany,
    };
  }

  // =========================================================
  // REMOVE
  // =========================================================
  async remove(id: string) {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    await this.companyRepository.remove(company);
    return {
      status: 200,
      message: 'Company removed successfully',
    };
  }
}
// =========================================================
