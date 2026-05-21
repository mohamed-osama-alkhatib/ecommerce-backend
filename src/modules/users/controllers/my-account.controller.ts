// my-account.controller.ts
// libs
import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';
// services
import { MyAccountService } from '../services/my-account.service';
// dto
import { UpdateMyAccountDto } from '../dto/update-my-account.dto';
// guards
import { AuthGuard } from '../guards/jwt-auth.guard';
// decorators
import { Roles } from '../decorators/roles.decorator';

@Controller('my-account')
export class MyAccountController {
  constructor(private readonly myAccountService: MyAccountService) {}

  // =========================================================
  // @Docs admin & employee & client can get user
  // @Route GET user
  // @Accuss "admin" or "employee" or "client"
  // =========================================================
  @Roles(['admin', 'employee', 'client'])
  @UseGuards(AuthGuard)
  @Get()
  display(@Req() req) {
    return this.myAccountService.display(req.user);
  }
  // =========================================================
  // @Docs admin & employee & client can update user
  // @Route PATCH user
  // @Accuss "admin" or "employee" or "client"
  // =========================================================
  @Patch('')
  @Roles(['admin', 'employee', 'client'])
  @UseGuards(AuthGuard)
  update(
    @Req() req,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateMyAccountDto: UpdateMyAccountDto,
  ) {
    return this.myAccountService.update(req.user, updateMyAccountDto);
  }

  // =========================================================
  // @Docs admin & employee & client can delete user
  // @Route DELETE user
  // @Accuss "admin" or "employee" or "client"
  // =========================================================
  @Delete('')
  @Roles(['admin', 'employee', 'client'])
  @UseGuards(AuthGuard)
  delete(@Req() req) {
    return this.myAccountService.delete(req.user);
  }
}
