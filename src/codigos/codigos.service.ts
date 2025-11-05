import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Usuario } from 'src/usuarios/usuarios.entity';
import { DataSource, Repository } from 'typeorm';
import { Codigo } from './codigos.entity';
import { CreateCodigoDTO } from './dto/createCodigos.dto';
import { UpdateCodigoDto } from './dto/updateCodigos.dto';
import { RegistrarColetaDTO } from './dto/registrarColeta.dto';
import { TGFEST } from 'src/tgfest/tgfest.entity';
import { TGFITE } from 'src/tgfite/tgfite.entity';

@Injectable()
export class CodigosService {

    private tgfestRepository: Repository<TGFEST>;
    private tgfiteRepository: Repository<TGFITE>;
    private codigoRepository: Repository<Codigo>;
    private usuarioRepository: Repository<Usuario>;

    constructor(@Inject('DATA_SOURCE') private dataSource: DataSource,) {

        this.tgfestRepository = this.dataSource.getRepository(TGFEST);
        this.tgfiteRepository = this.dataSource.getRepository(TGFITE);
        this.codigoRepository = this.dataSource.getRepository(Codigo);
        this.usuarioRepository = this.dataSource.getRepository(Usuario);

    }

    async registrar(dto: RegistrarColetaDTO): Promise<Codigo> {

        const produto = await this.tgfestRepository.findOne({ where: { codigoBarra: dto.numCodigo } });

        //valida se o produto pertence à nota
        if (!produto) {
            throw new NotFoundException(`Produto não encontrado, código de barras ${dto.numCodigo}`);
        }
        const codProd = produto.codProd;
        const itemNoPedido = await this.tgfiteRepository.findOne({
            where: { nunota: dto.nunota, codProd: codProd }
        });

        if (!itemNoPedido) {
            throw new NotFoundException(`Produto "${produto.descrProd}" não pertence a este pedido.`);
        }

        //valida quantidade
        const qtdPedida = itemNoPedido.qtdProd;
        const qtdJaColetada = await this.codigoRepository.count({
            where: { nunota: dto.nunota, codProd: codProd }
        });
        if (qtdJaColetada >= qtdPedida) {
            throw new BadRequestException(`Quantidade máxima do produto ${produto.descrProd} já coletada `)
        }

        const novoScan = this.codigoRepository.create({
            numCodigo: dto.numCodigo,
            tipo: dto.tipo,
            nunota: dto.nunota, 
            codProd: codProd,   
        });

        await this.codigoRepository.save(novoScan);

        return {
            ...novoScan,
            message: `Coletado ${qtdJaColetada + 1} de ${qtdPedida} (${produto.descrProd})`
        } as any

    };

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
