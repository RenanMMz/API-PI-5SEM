import { Inject, Injectable, Logger } from '@nestjs/common';
import { TGFCAB } from 'src/tgfcab/tgfcab.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ErpDataService {
  private readonly logger = new Logger(ErpDataService.name);
  private tgfcabRepository: Repository<TGFCAB>;

  constructor(@Inject('DATA_SOURCE') private dataSource: DataSource) {
    // Pega o repositório da TGFCAB usando o DataSource injetado
    this.tgfcabRepository = this.dataSource.getRepository(TGFCAB);
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
}