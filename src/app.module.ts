import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
// modules
import { UsersModule } from './modules/users/users.module';
// entities
import { User } from './modules/users/entities/user.entity';
import { City } from './modules/users/entities/city.entity';
import { District } from './modules/users/entities/district.entity';
// seeds
import { CitySeed } from './modules/users/seeds/city.seed';
import { DistrictSeed } from './modules/users/seeds/district.seed';

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
      entities: [User, City, District],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([City, District]),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [],
  providers: [CitySeed, DistrictSeed],
})
export class AppModule {}
