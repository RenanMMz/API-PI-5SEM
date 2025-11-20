import * as bcrypt from 'bcrypt';
import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Usuario } from './usuarios.entity';
import { CreateUserDTO } from './dto/usuarios.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { VaultData } from 'src/vaultData/vaultData.entity';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) { }

  async getUsuarios(): Promise<Usuario[]> {
    return await this.usuariosRepository.find();
  }

  async getUsuarioByEmail(email: string): Promise<Usuario | null> {
    return await this.usuariosRepository.findOne({ where: { email } });
  }


  async getUsuarioById(id: number): Promise<Usuario | null> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    return usuario || null;
  }

  async createUsuarios(createUserDTO: CreateUserDTO) {

    const existingUser = await this.usuariosRepository.findOne({ where: { email: createUserDTO.email } });
    if (existingUser) {
      throw new ConflictException('O e-mail informado já está em uso');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUsuario = queryRunner.manager.create(Usuario, {
        email: createUserDTO.email,
        senha: createUserDTO.senha,
        kdfSalt: createUserDTO.kdfSalt,
        criadoEm: new Date(),
      });
      await queryRunner.manager.save(newUsuario);

      const newVaultData = queryRunner.manager.create(VaultData, {
        usuario: newUsuario, // Vincula o Vault ao novo usuário
        encryptedBlob: createUserDTO.encryptedBlob,
        vaultIV: createUserDTO.vaultIV,
        vaultTag: createUserDTO.vaultTag,
        criadoEm: new Date(),
      });
      await queryRunner.manager.save(newVaultData);
      await queryRunner.commitTransaction();

      return {
        id: newUsuario.id,
        email: newUsuario.email,
        message: 'Usuário e Vault criados com sucesso',
      };


    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao criar usuário e Vault:', error);
      throw new BadRequestException('Erro no servidor ao finalizar o registro.');
    } finally {
      await queryRunner.release();
    }
  }

  async updateUsuarios(
    id: number,
    updateData: Partial<CreateUserDTO>,
  ): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateData.senha) {
      updateData.senha = await bcrypt.hash(updateData.senha, 10);
    }

    Object.assign(usuario, updateData);
    return await this.usuariosRepository.save(usuario);
  }
}