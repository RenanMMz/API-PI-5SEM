import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistrarRecebimentoDTO } from './dto/registrarRecebimento.dto';
import { TGFREC } from 'src/tgfrec/tgfrec.entity';
import { TGFDOCA } from 'src/tgfdoca/tgfdoca.entity';
import { TGFITE } from 'src/tgfite/tgfite.entity';
import { Usuario } from 'src/usuarios/usuarios.entity';
import { TGFEST } from 'src/tgfest/tgfest.entity';

type RecebimentoRetorno = TGFREC & { message: string };

@Injectable()
export class RecebimentoService {
    constructor(
        @InjectRepository(TGFREC)
        private readonly tgfrecRepository: Repository<TGFREC>,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        @InjectRepository(TGFDOCA)
        private readonly docaRepository: Repository<TGFDOCA>,
        @InjectRepository(TGFITE)
        private readonly tgfiteRepository: Repository<TGFITE>,
        @InjectRepository(TGFEST)
        private readonly tgfestRepository: Repository<TGFEST>,

    ) { }

    async registrarRecebimento(dto: RegistrarRecebimentoDTO, usuarioId: number): Promise<RecebimentoRetorno> {

        // quem está fazendo a coleta
        const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
        if (!usuario) {
            throw new NotFoundException(`Usuário Coletor com ID ${usuarioId} não encontrado.`);
        }

        // em qual doca a coleta está sendo feita
        const doca = await this.docaRepository.findOne({ where: { codDoca: dto.codDoca } });
        if (!doca) {
            throw new NotFoundException(`Doca ${dto.codDoca} não encontrada ou inativa.`);
        }

        // obter o CODPROD do produto
        const produto = await this.tgfestRepository.findOne({ where: { codigoBarra: dto.numCodigo } });
        if (!produto) {
            throw new NotFoundException(`Produto com código de barras ${dto.numCodigo} não encontrado no cadastro.`);
        }
        const codProd = produto.codProd;

        // o produto está na nota? Se sim, qual a quantidade?
        const itemNoRecebimento = await this.tgfiteRepository.findOne({
            where: { nunota: dto.nunota, codProd: codProd }

        });

        if (!itemNoRecebimento) {
            throw new BadRequestException(`Produto "${produto.descrProd}" não é esperado na Nota ${dto.nunota}.`);
        }

        const qtdEsperada = itemNoRecebimento.qtdProd;

        // validar quantidade
        if (dto.qtdContada + dto.qtdAvariada === 0) {
            throw new BadRequestException('A quantidade total contada (normal + avariada) deve ser maior que zero.');
        }

        // conferência e divergência
        const qtdTotalContada = dto.qtdContada + dto.qtdAvariada;
        let divergente: boolean = false;
        let message: string;

        if (qtdTotalContada > qtdEsperada) {
            if (dto.confirmarDivergencia !== true) {
                // Se o usuário não confirmou a divergência, lança exceção pedindo confirmação ou ação
                throw new BadRequestException(`Divergência: Contada ${qtdTotalContada}, Esperada ${qtdEsperada}. Confirme a divergência para registrar.`);
            }
            // Se a divergência foi confirmada, marca como divergente
            divergente = true;
            message = `Registrada divergência (CONFIRMADA). Contado ${qtdTotalContada} de ${qtdEsperada} (${produto.descrProd}).`;

        } else if (qtdTotalContada < qtdEsperada) {
            message = `Contagem parcial registrada. Contado ${qtdTotalContada} de ${qtdEsperada} (${produto.descrProd}).`;
        } else {
            message = `Contagem COMPLETA e correta registrada. Contado ${qtdTotalContada} de ${qtdEsperada} (${produto.descrProd}).`;
        }


        // salvar o registro de recebimento
        const novoRegistro = this.tgfrecRepository.create({
            doca: doca,
            produto: produto, 
            usuario: usuario, 

            qtdContada: dto.qtdContada,
            qtdAvariada: dto.qtdAvariada,
            nunotaOrigem: dto.nunota,
            divergente: divergente

        });

        await this.tgfrecRepository.save(novoRegistro);

        // sucesso
        return {
            ...novoRegistro,
            message: message,
        } as RecebimentoRetorno;

    }
}