import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Codigo } from 'src/codigos/codigos.entity';
import { TGFCAB } from 'src/tgfcab/tgfcab.entity';
import { TGFITE } from 'src/tgfite/tgfite.entity';
import { Usuario } from 'src/usuarios/usuarios.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ErpDataService {
  private readonly logger = new Logger(ErpDataService.name);
  private tgfcabRepository: Repository<TGFCAB>;
  private usuarioRepository: Repository<Usuario>;
  private tgfiteRepository: Repository<TGFITE>;
  private codigoRepository: Repository<Codigo>;

  constructor(@Inject('DATA_SOURCE') private dataSource: DataSource) {
    // Pega o repositório da TGFCAB usando o DataSource injetado
    this.tgfcabRepository = this.dataSource.getRepository(TGFCAB);
    this.usuarioRepository = this.dataSource.getRepository(Usuario);
    this.tgfiteRepository = this.dataSource.getRepository(TGFITE);
    this.codigoRepository = this.dataSource.getRepository(Codigo);
  }

  /**
   * Busca todas as notas (cabeçalhos) que estão com o status 'pendente'.
   */
  async findNotasPendentes(): Promise<TGFCAB[]> {
    this.logger.log('Buscando notas com status "pendente"...');

    const notas = await this.tgfcabRepository.find({
      where: {
        statusNota: 'pendente', // Filtro exato
      },
      select: {
        nunota: true, // Número único (chave de negócio)
        nunNota: true, // Número da nota (para o usuário ver)
        codParc: true, // Código do Parceiro (Cliente)
      },
      order: {
        nunota: 'ASC', // Mostra as notas mais antigas primeiro
      },
    });

    this.logger.log(`Encontradas ${notas.length} notas pendentes.`);
    return notas;
  }

  async atribuirProximaNota(usuarioId: number): Promise<TGFCAB> {
    this.logger.log(`Usuário ${usuarioId} solicitou a próxima nota...`);

    // Busca o usuário
    const usuario = await this.usuarioRepository.findOneBy({ id: usuarioId });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const notaAtiva = await this.tgfcabRepository.findOne({
      where: {
        statusNota: 'em_coleta',
        usuarioColeta: { id: usuarioId }
      },
      relations: {
        usuarioColeta: true
      }
    });

    if (notaAtiva) {
      this.logger.log(`Usuário ${usuarioId} já possui a nota ${notaAtiva.nunota} em coleta. Retornando...`);
      return notaAtiva;
    }

    // Encontrar a próxima nota pendente
    const proximaNota = await this.tgfcabRepository.findOne({
      where: {
        statusNota: 'pendente',
      },
      order: {
        nunota: 'ASC', // A nota mais antiga
      },
    });

    // Se não houver notas, avise o operador
    if (!proximaNota) {
      this.logger.log('Nenhuma nota pendente encontrada.');
      throw new NotFoundException('Nenhuma nota pendente encontrada.');
    }

    // Mudar o status e associar ao usuário
    proximaNota.statusNota = 'em_coleta';
    proximaNota.usuarioColeta = usuario;

    await this.tgfcabRepository.save(proximaNota);

    this.logger.log(`Nota ${proximaNota.nunota} atribuída ao usuário ${usuario.nome}.`);

    // Retornar a nota
    return proximaNota;
  }

  async finalizarColeta(nunota: number, usuarioId: number): Promise<TGFCAB> {

    this.logger.log(`Usuário ${usuarioId} solicitou finalização da nota ${nunota}...`);

    const nota = await this.tgfcabRepository.findOne({
      where: { nunota, statusNota: 'em_coleta', usuarioColeta: { id: usuarioId } },
    });
    if (!nota) {
      throw new NotFoundException(`Nota ${nunota} não encontrada ou não está 'em_coleta' por este usuário`);
    }
    const itensDoPedido = await this.tgfiteRepository.find({
      where: { nunota: nunota },
    });

    if (itensDoPedido.length === 0) {
      throw new NotFoundException(`Nenhum item encontrado para a nota ${nunota}`);
    }

    for (const item of itensDoPedido) {
      const qtdPedida = item.qtdProd;
      const qtdColetada = await this.codigoRepository.count({
        where: {
          nunota: nunota,
          codProd: item.codProd,
        },
      });

      if (qtdColetada < qtdPedida) {
        this.logger.warn(`Finalização falhou: Item ${item.codProd} incompleto. Pedido: ${qtdPedida}, Coletado: ${qtdColetada}`);
        throw new BadRequestException(
          `Coleta incompleta. O item ${item.codProd} (Qtd: ${qtdColetada}/${qtdPedida}) ainda não foi totalmente coletado.`,
        );
      }
    }

    this.logger.log(`Nota ${nunota} verificada e completa. Finalizando...`);
    nota.statusNota = 'concluido';
    nota.usuarioColeta = null;
    const notaAtualizada = await this.tgfcabRepository.save(nota);

    return notaAtualizada;


  }

}