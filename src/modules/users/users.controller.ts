// Users.controller.ts
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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guard/Auth.guard';
import { Roles } from './decorator/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Docs admin can create user
  // @Route POST user
  // @Accuss private "admin"
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  // @Docs admin can get all users
  // @Route GET users
  // @Accuss private "admin"
  @Roles(['admin'])
  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  // @Docs admin can get user
  // @Route GET one user
  // @Accuss private "admin"
  @Roles(['admin'])
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // @Docs admin can update user
  // @Route PATCH user
  // @Accuss private "admin"
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    UpdateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, UpdateUserDto);
  }

  // @Docs admin can delete user
  // @Route DELETE user
  // @Accuss private "admin"
  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
