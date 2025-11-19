import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  Req,
  UseGuards,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usuariosService: UsuariosService
  ) { }

  // get da chave pública (kdfSalt) do usuário pelo email
  @Get('kdfsalt')
  async getKdfSaltByEmail(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('O parâmetro email é obrigatório.');
    }

    const usuario = await this.usuariosService.getUsuarioByEmail(email);

    if (!usuario) {
      //não pode informar se o usuário existe ou não por questões de segurança, retorna mensagem "genérica"
      throw new NotFoundException('Usuário não encontrado ou credencial inválida.');
    }

    // apenas a chave pública, demais informações são confidenciais
    return {
      kdfSalt: usuario.kdfSalt
    };
  }

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
