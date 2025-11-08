import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDTO,
  ) {
    const result = await this.authService.login(loginDto);

    return {
      message: 'Login realizado com sucesso',
      access_token: result.token,
      usuario: result.usuario,
    };
  }
}
