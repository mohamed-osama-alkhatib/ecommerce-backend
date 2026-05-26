// auth.module.ts

// libs
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// services
import { AuthService } from './auth.service';
// controllers
import { AuthController } from './auth.controller';
// entities
import { User } from '../users/entities/user.entity';
import { District } from '../users/entities/district.entity';
import { City } from '../users/entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, City, District])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
