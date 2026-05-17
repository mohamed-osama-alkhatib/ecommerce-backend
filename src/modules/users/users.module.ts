import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, City, District])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
