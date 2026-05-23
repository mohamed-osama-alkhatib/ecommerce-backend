import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Roles } from '../decorators/roles.decorator';

// إذا لم تقم بوضع هذا الجزء في ملف منفصل (كما شرحنا بالأعلى)، اتركه هنا.
// أما إذا وضعته في ملف منفصل، يمكنك حذف هذا الجزء من هنا واستيراد JwtPayload فقط.
export interface JwtPayload {
  id: number;
  phoneNumber: string;
  role: string;
}

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}
// ---------------------------------------------------------

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    // --- 1. التحقق من التوكن (Authentication) ---
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });

      if (!payload.id) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // بفضل دمج الأنواع (Declaration Merging)، TypeScript الآن يعرف أن request.user موجود
      request.user = payload;
    } catch (error) {
      // تمرير الأخطاء التي قمنا برمياها مسبقاً كما هي
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      // أي خطأ آخر (مثل انتهاء صلاحية التوكن) سيتم تحويله إلى هذا الخطأ
      throw new UnauthorizedException('Invalid or expired token');
    }

    // --- 2. التحقق من الصلاحيات (Authorization) ---
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    // إذا كان المسار لا يتطلب صلاحيات معينة، اسمح بالمرور
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // التحقق مما إذا كان دور المستخدم ضمن الأدوار المطلوبة
    if (!request.user || !requiredRoles.includes(request.user.role)) {
      throw new ForbiddenException('Access denied: insufficient permissions');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
