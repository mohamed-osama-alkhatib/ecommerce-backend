// users.module.ts
// Libs
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Services
import { UsersService } from './services/users.service';
import { MyAccountService } from './services/my-account.service';

// controllers
import { UsersController } from './controllers/users.controller';
import { MyAccountController } from './controllers/my-account.controller';
// entities
import { User } from './entities/user.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, City, District])],
  controllers: [UsersController, MyAccountController],
  providers: [UsersService, MyAccountService],
})
export class UsersModule {}
