// app.module.ts

// libs
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
// modules
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SubcategoriesModule } from './modules/subcategories/subcategories.module';
// seeds
import { CitySeed } from './common/seeds/city.seed';
import { DistrictSeed } from './common/seeds/district.seed';
// entities
import { City } from './common/entities/city.entity';
import { District } from './common/entities/district.entity';
import { User } from './common/entities/user.entity';
import { Category } from './common/entities/category.entity';
import { Subcategory } from './common/entities/subcategory.entity';
import { Company } from './common/entities/company.entity';
import { Representative } from './common/entities/representative.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        City,
        District,
        User,
        Category,
        Subcategory,
        Company,
        Representative,
      ],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([
      User,
      City,
      District,
      Category,
      Subcategory,
      Company,
      Representative,
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '600s' },
    }),
    MailerModule.forRoot({
      transport: {
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_NAME,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      },
    }),
    UsersModule,
    AuthModule,
    CompaniesModule,
    CategoriesModule,
    SubcategoriesModule,
  ],
  providers: [CitySeed, DistrictSeed],
})
export class AppModule {}
