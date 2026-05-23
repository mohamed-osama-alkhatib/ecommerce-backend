import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from '../users/entities/district.entity';
import { City } from '../users/entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, City, District])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
