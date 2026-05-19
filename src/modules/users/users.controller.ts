import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guard/Auth.guard';
import { Roles } from './decorator/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto,
    @Req() req,
  ) {
    return this.usersService.create(createUserDto, req.user);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
