import * as bcrypt from 'bcrypt';
import {
    Inject,
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
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
    ) { }

    async createVaultData(userId: number, createVaultDataDTO: createVaultDataDTO) {
        //Validação de user
        const usuario = await this.usuariosRepository.findOne({ where: { id: userId } });
        if (!usuario) {
            throw new BadRequestException('Usuário não encontrado');
        }

        //validação de "se esse user já tem um vaultData"
        const existingVault = await this.vaultDataRepository.findOne ({ where: { usuario:{ id: userId }}});
        if (existingVault){
            throw new BadRequestException('Usuário já possui um vaultData')
        }
        
        try {
            const vaultData = this.vaultDataRepository.create({

                ...createVaultDataDTO,
                usuario: usuario,
                criadoEm: new Date(),

            });

            return await this.vaultDataRepository.save(vaultData);;
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Erro ao criar VaultData');
        }
    }
}