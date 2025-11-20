import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { VaultData } from './vaultData.entity';
import { createVaultDataDTO } from './dto/createVaultData.dto';
import { Usuario } from 'src/usuarios/usuarios.entity';

@Injectable()
export class VaultDataService {
    constructor(
        @InjectRepository(VaultData)
        private vaultDataRepository: Repository<VaultData>,
        @InjectRepository(Usuario)
        private usuariosRepository: Repository<Usuario>,
        @InjectDataSource()
        private dataSource: DataSource,
    ) { }

    async getVaultDataByUserId(userId: number): Promise<VaultData | null> {
        return await this.vaultDataRepository.findOne({
            where: { usuario: { id: userId } }
        });
    }

    async updateVaultData(
        userId: number,
        updateData: Partial<createVaultDataDTO>,
    ): Promise<void> {
        // VaultData do usuário
        const vaultData = await this.vaultDataRepository.findOne({
            where: { usuario: { id: userId } }
        });

        if (!vaultData) {
            throw new NotFoundException('VaultData não encontrado para o usuário.');
        }

        // Atualiza apenas os campos permitidos
        vaultData.encryptedBlob = updateData.encryptedBlob || vaultData.encryptedBlob;
        vaultData.vaultIV = updateData.vaultIV || vaultData.vaultIV;
        vaultData.vaultTag = updateData.vaultTag || vaultData.vaultTag;

        await this.vaultDataRepository.save(vaultData);
    }

    async deleteAccountAndVault(userId: number): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Deleta o VaultData, cascade: true no delete de usuário serve mas para segurança estou deletando aqui também
            const vaultResult = await queryRunner.manager.delete(VaultData, { usuario: { id: userId } });

            // Deleta o usuário
            const userResult = await queryRunner.manager.delete(Usuario, userId);

            if (userResult.affected === 0) {
                throw new NotFoundException('Usuário não encontrado para deleção.');
            }

            await queryRunner.commitTransaction();

        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Erro ao deletar conta e Vault:', error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Erro ao deletar conta.');
        } finally {
            await queryRunner.release();
        }
    }
}