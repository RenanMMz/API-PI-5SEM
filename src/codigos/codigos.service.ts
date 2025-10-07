import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/usuarios.entity';
import { DataSource, Repository } from 'typeorm';
import { Codigo } from './codigos.entity';
import { CreateCodigoDTO } from './dto/createCodigos.dto';
import { UpdateCodigoDto } from './dto/updateCodigos.dto';

@Injectable()
export class CodigosService {

    private codigoRepository: Repository<Codigo>;
    private usuarioRepository: Repository<Usuario>;

    constructor(@Inject('DATA_SOURCE') private dataSource: DataSource,) {

        this.codigoRepository = this.dataSource.getRepository(Codigo);
        this.usuarioRepository = this.dataSource.getRepository(Usuario);

    }

    async criar(createCodigoDTO: CreateCodigoDTO): Promise<Codigo> {
        const { numCodigo, tipo, usuarioId } = createCodigoDTO;

        const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
        if (!usuario) {
            throw new NotFoundException(`Usuário com ID ${usuarioId} não encontrado`);
        }

        const codigo = this.codigoRepository.create({
            numCodigo,
            usuario,
            tipo,
        });

        return await this.codigoRepository.save(codigo);
    }

    async listarTodos(): Promise<Codigo[]> {
        return await this.codigoRepository.find({
            relations: ['usuario'],
            order: { criadoEm: 'DESC' },
        });
    }

    async buscarPorId(id: number): Promise<Codigo> {
        const codigo = await this.codigoRepository.findOne({
            where: { id },
            relations: ['usuario'],
        });

        if (!codigo) {
            throw new NotFoundException(`Código com ID ${id} não encontrado`);
        }

        return codigo;
    }

    async atualizar(id: number, updateDto: UpdateCodigoDto): Promise<Codigo> {
        const codigo = await this.buscarPorId(id);
        Object.assign(codigo, updateDto);
        return await this.codigoRepository.save(codigo);
    }

    async remover(id: number): Promise<void> {
        const codigo = await this.buscarPorId(id);
        await this.codigoRepository.remove(codigo);
    }

}
