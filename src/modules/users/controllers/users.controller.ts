// Users.controller.ts
// libs
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  ValidationPipe,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
// services
import { UsersService } from '../services/users.service';
// dto
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindUsersDto } from '../dto/find-users.dto';
// guards
import { AuthGuard } from '../guards/jwt-auth.guard';
// decorators
import { Roles } from '../decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // =========================================================
  // @Docs admin can create user
  // @Route POST user
  // @Accuss private "admin"
  // =========================================================
  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  // =========================================================
  // @Docs admin can get all users
  // @Route GET users
  // @Accuss private "admin"
  // =========================================================
  @Get()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  findAll(@Query() query: FindUsersDto) {
    return this.usersService.findAll(query);
  }
  // =========================================================
  // @Docs admin can get user
  // @Route GET one user
  // @Accuss private "admin"
  // =========================================================

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // =========================================================
  // @Docs admin can update user
  // @Route PATCH user
  // @Accuss private "admin"
  // =========================================================
  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    UpdateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, UpdateUserDto);
  }

  // =========================================================
  // @Docs admin can delete user
  // @Route DELETE user
  // @Accuss private "admin"
  // =========================================================
  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
