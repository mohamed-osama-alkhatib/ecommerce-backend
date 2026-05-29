// auth.module.ts

// libs
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// services
import { AuthService } from './services/auth.service';
// controllers
import { AuthController } from './controllers/auth.controller';
// entities
import { User } from '../../common/entities/user.entity';
import { District } from '../../common/entities/district.entity';
import { City } from '../../common/entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, City, District])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
