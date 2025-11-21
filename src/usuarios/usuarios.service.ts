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
import { UpdateUserDTO } from './dto/updateUsuarios.dto';

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
      const hashedPassword = await bcrypt.hash(createUserDTO.senha, 10);
      const newUsuario = queryRunner.manager.create(Usuario, {
        email: createUserDTO.email,
        senha: hashedPassword,
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

  async updateUser(
    userId: number,
    updateData: UpdateUserDTO,
  ): Promise<void> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //update usuário
      const usuario = await queryRunner.manager.findOne(Usuario, { where: { id: userId } })
      if (!usuario) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      const hashedPassword = await bcrypt.hash(updateData.novaSenha, 10);

      usuario.senha = hashedPassword;
      usuario.kdfSalt = updateData.novoKdfSalt;
      await queryRunner.manager.save(usuario);

      //update vaultData
      const vaultData = await queryRunner.manager.findOne(VaultData, { where: { usuario: { id: userId } } });
      if (!vaultData) {
        throw new NotFoundException('VaultData não encontrado.');
      }
      vaultData.encryptedBlob = updateData.novoEncryptedBlob;
      vaultData.vaultIV = updateData.novoVaultIV;
      vaultData.vaultTag = updateData.novoVaultTag;
      await queryRunner.manager.save(vaultData);

      await queryRunner.commitTransaction();

    } catch (error){
      //rollback
      await queryRunner.rollbackTransaction()
      console.error ('erro na transação de atualização de senha ou vaultData', error);

      if (error instanceof NotFoundException){
        throw error;
      }
      throw new BadRequestException('Não foi possível atualizar senha ou vaultData')
    } finally {
      await queryRunner.release();
    }

  }
}