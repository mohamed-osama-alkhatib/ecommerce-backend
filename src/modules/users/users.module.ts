// users.module.ts
// Libs
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Services
import { UsersService } from './users.service';
// controllers
import { UsersController } from './users.controller';
// entities
import { User } from './entities/user.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, City, District])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
