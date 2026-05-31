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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FindCompaniesDto } from './dto/find-companies.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  // =========================================================
  // @Docs admin & employee can create company
  // @Route POST company
  // @Accuss private "admin & employee"
  // =========================================================
  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin', 'employee'])
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createCompanyDto: CreateCompanyDto,
  ) {
    return this.companiesService.create(createCompanyDto);
  }

  // =========================================================
  // @Docs admin can get all companies
  // @Route GET companies
  // @Accuss public
  // =========================================================
  @Get()
  findAll(@Query() query: FindCompaniesDto) {
    return this.companiesService.findAll(query);
  }

  // =========================================================
  // @Docs admin & employee can get company
  // @Route GET one company/id
  // @Accuss public
  // =========================================================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  // =========================================================
  // @Docs admin & employee can update company
  // @Route PATCH company/id
  // @Accuss private "admin & employee"
  // =========================================================
  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin', 'employee'])
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  // =========================================================
  // @Docs admin can delete company
  // @Route DELETE company/id
  // @Accuss private "admin"
  // =========================================================
  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
