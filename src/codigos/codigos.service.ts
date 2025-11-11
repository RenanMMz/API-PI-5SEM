import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Usuario } from 'src/usuarios/usuarios.entity';
import { DataSource, Repository } from 'typeorm';
import { Codigo } from './codigos.entity';
import { RegistrarColetaDTO } from './dto/registrarColeta.dto';
import { TGFEST } from 'src/tgfest/tgfest.entity';
import { TGFITE } from 'src/tgfite/tgfite.entity';

type RegistratorColetaRetorno = Codigo & { message: string; action?: 'AvisoDivergencia' | 'ReiniciarColeta' };

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

    async registrar(dto: RegistrarColetaDTO, usuarioId: number): Promise<RegistratorColetaRetorno> {

        //buscar o usuário
        const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
        if (!usuario) {
            throw new NotFoundException(`Usuário Coletor com ID ${usuarioId} não encontrado`);
        }

        //valida se o produto pertence à nota
        const produto = await this.tgfestRepository.findOne({ where: { codigoBarra: dto.numCodigo } });

        if (!produto) {
            throw new NotFoundException(`Produto não encontrado, código de barras ${dto.numCodigo}`);
        }
        const codProd = produto.codProd;

        //valida se o produto pertence à nota
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
        const proximaQtdColetada = qtdJaColetada + 1;

        // CASO 1: Quantidade acima do pedido

        if (proximaQtdColetada > qtdPedida) {
            // SE o usuário NÃO confirmou a divergência
            if (dto.confirmarDivergencia !== true) {
                // 🔁 Reinicia a coleta (zera registros existentes)
                await this.codigoRepository.delete({ nunota: dto.nunota, codProd });

                return {
                    message: `Atenção! A quantidade coletada do produto ${produto.descrProd} excedeu o pedido. A coleta foi reiniciada — por favor, recomece a coleta do produto.`,
                    action: 'ReiniciarColeta',
                } as any;
            }

            // SE o usuário confirmou a divergência
            const novoScan = this.codigoRepository.create({
                numCodigo: dto.numCodigo,
                tipo: dto.tipo,
                nunota: dto.nunota,
                codProd,
                usuario: usuario,
                divergente: true,
            });

            await this.codigoRepository.save(novoScan);

            return {
                ...novoScan,
                message: `Divergência confirmada! Coletado ${proximaQtdColetada} de ${qtdPedida} (${produto.descrProd}).`,
            } as any;
        }

        // CASO 2: Quantidade igual ao pedido

        if (proximaQtdColetada === qtdPedida) {
            const novoScan = this.codigoRepository.create({
                numCodigo: dto.numCodigo,
                tipo: dto.tipo,
                nunota: dto.nunota,
                codProd,
                usuario: usuario,
            });

            await this.codigoRepository.save(novoScan);

            return {
                ...novoScan,
                message: `Coleta COMPLETA! Coletado ${proximaQtdColetada} de ${qtdPedida} (${produto.descrProd}).`,
            } as any;
        }

        // CASO 3: Quantidade abaixo do pedido

        const novoScan = this.codigoRepository.create({
            numCodigo: dto.numCodigo,
            tipo: dto.tipo,
            nunota: dto.nunota,
            codProd,
            usuario: usuario,
        });

        await this.codigoRepository.save(novoScan);

        return {
            ...novoScan,
            message: `Coletado ${proximaQtdColetada} de ${qtdPedida} (${produto.descrProd}).`,
        } as any;


        /*if (qtdJaColetada >= qtdPedida) {
            throw new BadRequestException(`Quantidade máxima do produto ${produto.descrProd} já coletada `)
        }*/

        /*const novoScan = this.codigoRepository.create({
            numCodigo: dto.numCodigo,
            tipo: dto.tipo,
            nunota: dto.nunota,
            codProd: codProd,
            usuario: usuario,
        });*/
    };

    /*async criar(createCodigoDTO: CreateCodigoDTO): Promise<Codigo> {
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
    }*/

}
