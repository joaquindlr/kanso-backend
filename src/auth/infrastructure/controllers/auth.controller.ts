import {
  Controller,
  Post,
  UseGuards,
  Request as NestRequest,
  Body,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterDto } from '../../application/dtos/register.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../../../users/domain/user.entity';

interface LocalRequest extends Request {
  user: Omit<User, 'passwordHash'>;
}

interface JwtRequest extends Request {
  user: { id: string; email: string };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@NestRequest() req: LocalRequest) {
    return this.loginUseCase.execute(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@NestRequest() req: JwtRequest) {
    return req.user;
  }
}
