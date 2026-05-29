// auth.service.ts

// libs
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
// entities
import { User } from '../../../common/entities/user.entity';
import { District } from '../../../common/entities/district.entity';
import { City } from '../../../common/entities/city.entity';
// dto
import { SignUpUserDto } from '../dto/signup-user.dto';
import { SignInUserDto } from '../dto/signin-user.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { VerifyCodeDto } from '../dto/verify-code.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

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
    private readonly mailService: MailerService,
  ) {}

  // =========================================================
  // signUp
  // =========================================================
  async signUp(signUpUserDto: SignUpUserDto) {
    const user = await this.userRepository.findOneBy({
      email: signUpUserDto.email,
    });
    if (user)
      throw new HttpException('User with this email already exists', 400);
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

    // email
    const ifUserExist = await this.userRepository.findOne({
      where: { email: signUpUserDto.email },
    });

    if (ifUserExist) {
      throw new HttpException('User already exist', 400);
    }

    // password
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS);

    const password = await bcrypt.hash(signUpUserDto.password, saltOrRounds);

    const newUser = await this.userRepository.create({
      ...rest,
      city: isCity,
      district: isDistrict,
      password,
      isActive: true,
    });

    const createdUser = await this.userRepository.save(newUser);

    const payload = {
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      status: 201,
      message: 'User signed up successfully',
      data: createdUser,
      accessToken: token,
    };
  }

  // =========================================================
  // signIn
  // =========================================================
  async signIn(signInUserDto: SignInUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: signInUserDto.email },
    });
    if (!user)
      throw new NotFoundException('User with this email does not exist');

    const isMatch = await bcrypt.compare(signInUserDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException();

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    const registeredUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.city', 'city')
      .leftJoin('user.district', 'district')
      .select([
        'user.id',
        'user.avatar',
        'user.firstName',
        'user.lastName',
        'user.dateOfBirth',
        'user.email',
        'user.createdAt',
        'user.gender',
        'user.role',
        'city.code',
        'city.name',
        'district.id',
        'district.name',
      ])
      .where('user.email = :email', { email: user.email })
      .getOne();

    return {
      status: 201,
      message: 'User signed in successfully',
      data: registeredUser,
      accessToken: token,
    };
  }

  // =========================================================
  // reset user's password
  // =========================================================
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: resetPasswordDto.email },
    });
    if (!user)
      throw new NotFoundException('User with this email does not exist');

    // ==========================
    // create verifiaction code
    // ==========================
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Verification code:', code);

    // ==========================
    // insert code to database
    // ==========================
    await this.userRepository.update(
      { email: resetPasswordDto.email },
      { verificationCode: code },
    );

    // ==========================
    // send code to user's email
    // ==========================
    const htmlMessage = `
     <div>
      <h1>Password Reset Request</h1>
      <p>We received a request to reset your password. Use the verification code below to reset your password:</p>
      <h2 style="color: #007bff; font-weight: bold; text-align: center;">${code}</h2>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thank you </p>
      <h6 style="color: #6c757d; font-size: 14px; text-align: center;">${process.env.EMAIL_APP_NAME}</h6>
     </div>
    `;

    try {
      await this.mailService.sendMail({
        from: `Barada Link <${process.env.EMAIL_NAME}>`,
        to: resetPasswordDto.email,
        subject: `Password Reset Code`,
        text: `Your password reset code is: ${code}. If you did not request this, please ignore this email.`,
        html: htmlMessage,
      });
    } catch (error) {
      console.error('Failed to send reset email:', error);
      throw new InternalServerErrorException(
        'Failed to send the verification email. Please try again later.',
      );
    }

    return {
      status: 200,
      message: `Verification code sent to email (${resetPasswordDto.email}) successfully`,
    };
  }

  // =========================================================
  // Verification user's code
  // =========================================================
  async verifyCode(verifyCodeDto: VerifyCodeDto) {
    const email = verifyCodeDto.email;
    const code = verifyCodeDto.verificationCode;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'verificationCode'] as (keyof User)[],
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.verificationCode !== code)
      throw new UnauthorizedException('Invalid verification code');

    await this.userRepository.update({ email }, { verificationCode: null });

    return {
      status: 200,
      message: 'Code verified successfully',
    };
  }

  // =========================================================
  // Change user's password
  // =========================================================
  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: changePasswordDto.email },
    });
    if (!user) throw new NotFoundException('User not found');
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS);
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.password,
      saltOrRounds,
    );
    await this.userRepository.update(
      { email: changePasswordDto.email },
      { password: hashedPassword },
    );
    return {
      status: 200,
      message: 'Password changed successfully',
    };
  }
  //
}
