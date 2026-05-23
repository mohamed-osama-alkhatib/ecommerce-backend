import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserDto } from './dto/signup-user.dto';
import * as bcrypt from 'bcrypt';
import { City } from '../users/entities/city.entity';
import { District } from '../users/entities/district.entity';
import { JwtService } from '@nestjs/jwt';
import { SignInUserDto } from './dto/signin-user.dto';
import { dataSelectedToGet } from '../users/data/get.data';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    private jwtService: JwtService,
  ) {}

  // =========================================================
  // @Docs admin can signUp user
  // @Route POST auth/signup
  // @Accuss public
  // =========================================================
  async signUp(signUpUserDto: SignUpUserDto) {
    const user = await this.userRepository.findOneBy({
      phoneNumber: signUpUserDto.phoneNumber,
    });
    if (user)
      throw new HttpException(
        'User with this phone number already exists',
        400,
      );
    const { city, district, ...rest } = signUpUserDto;

    // check city
    const isCity = await this.cityRepository.findOne({
      where: { code: city },
    });

    if (!isCity) {
      throw new NotFoundException('City not found');
    }

    // check district belongs to city
    const isDistrict = await this.districtRepository.findOne({
      where: {
        id: district,
        city: {
          code: city,
        },
      },
      relations: {
        city: true,
      },
    });

    if (!isDistrict) {
      throw new NotFoundException('District does not belong to selected city');
    }

    // phone number
    const ifUserExist = await this.userRepository.findOne({
      where: { phoneNumber: signUpUserDto.phoneNumber },
    });

    if (ifUserExist) {
      throw new HttpException('User already exist', 400);
    }

    // password
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS);

    const password = await bcrypt.hash(signUpUserDto.password, saltOrRounds);

    const newUser = this.userRepository.create({
      ...rest,
      city: isCity,
      district: isDistrict,
      password,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(newUser);

    const createdUser = await this.userRepository.findOne({
      where: { id: savedUser.id },
      select: dataSelectedToGet as [],
    });

    if (!createdUser) {
      throw new NotFoundException('User not found after creation');
    }

    const payload = {
      id: createdUser.id,
      phoneNumber: createdUser.phoneNumber,
      role: createdUser.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      status: 201,
      message: 'User signed up successfully',
      data: createdUser,
      accussToken: token,
    };
  }

  // =========================================================
  // @Docs admin can signUp user
  // @Route POST auth/signup
  // @Accuss public
  // =========================================================
  async signIn(signInUserDto: SignInUserDto) {
    const user = await this.userRepository.findOne({
      where: { phoneNumber: signInUserDto.phoneNumber },
      select: [...dataSelectedToGet, 'password'] as (keyof User)[],
    });
    if (!user)
      throw new NotFoundException('User with this phone number does not exist');

    console.log('==>', user.password, signInUserDto.password);
    const isMatch = await bcrypt.compare(signInUserDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException();

    const payload = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    const { password, ...userWithoutPassword } = user;

    return {
      status: 201,
      message: 'User signed in successfully',
      data: userWithoutPassword,
      accussToken: token,
    };
  }
}
