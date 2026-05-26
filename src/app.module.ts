import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
// modules
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
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
    MailerModule.forRoot({
      transport: {
        // host: process.env.EMAIL_HOST,
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_NAME,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      },
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [CitySeed, DistrictSeed],
})
export class AppModule {}
