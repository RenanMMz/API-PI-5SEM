import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from "typeorm";
import { Usuario } from '../usuarios/usuarios.entity';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { VaultData } from 'src/vaultData/vaultData.entity';
import { encrypt } from 'src/utils/crypto.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(VaultData)
    private vaultDataRepository: Repository<VaultData>,
    private jwtService: JwtService,
  ) { }

  async login({ email, senha }: LoginDTO) {
    //usuário
    const usuario = await this.usuariosRepository.findOne({
      where: { email },
      relations: ['vaultData'],
    });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    //senha
    const passwordMatches = await bcrypt.compare(senha, usuario.senha);
    if (!passwordMatches) {
      throw new UnauthorizedException('Senha incorreta');
    }

    //vaultData carregado, só por segurança
    if (!usuario.vaultData) {
      throw new NotFoundException('VaultData do usuário não encontrado');
    }

    //token jwt
    const payload = { sub: usuario.id };
    const token = this.jwtService.sign(payload);
    return {
      message: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
      },
      vaultData: {
        encryptedBlob: usuario.vaultData.encryptedBlob,
        vaultIV: usuario.vaultData.vaultIV,
        vaultTag: usuario.vaultData.vaultTag,
      }
    };
  }
}