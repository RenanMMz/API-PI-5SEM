import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TGFCAB } from 'src/tgfcab/tgfcab.entity';
import { Usuario } from 'src/usuarios/usuarios.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ErpDataService {
  private readonly logger = new Logger(ErpDataService.name);
  private tgfcabRepository: Repository<TGFCAB>;
  private usuarioRepository: Repository<Usuario>;

  constructor(@Inject('DATA_SOURCE') private dataSource: DataSource) {
    // Pega o repositório da TGFCAB usando o DataSource injetado
    this.tgfcabRepository = this.dataSource.getRepository(TGFCAB);
    this.usuarioRepository = this.dataSource.getRepository(Usuario);
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

    // 1. Busca o usuário (necessário para a trava recomendada)
    const usuario = await this.usuarioRepository.findOneBy({ id: usuarioId });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // 2. Encontrar a próxima nota pendente (a mais antiga)
    const proximaNota = await this.tgfcabRepository.findOne({
      where: {
        statusNota: 'pendente',
      },
      order: {
        nunota: 'ASC', // Garante que seja a mais antiga
      },
    });

    // 3. Se não houver notas, avise o operador
    if (!proximaNota) {
      this.logger.log('Nenhuma nota pendente encontrada.');
      throw new NotFoundException('Nenhuma nota pendente encontrada.');
    }

    // 4. "Travar" a nota: Mudar o status e associar ao usuário
    proximaNota.statusNota = 'em_coleta';
    proximaNota.usuarioColeta = usuario; // <-- Passo recomendado
    
    await this.tgfcabRepository.save(proximaNota);

    this.logger.log(`Nota ${proximaNota.nunota} atribuída ao usuário ${usuario.nome}.`);

    // 5. Retornar a nota
    return proximaNota;
  }
}