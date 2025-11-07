import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { ErpDataService } from './erp-data.service';
import { TGFCAB } from 'src/tgfcab/tgfcab.entity';

@Controller('erp') // Define o prefixo da rota (ex: /erp/...)
export class ErpDataController {
  private readonly logger = new Logger(ErpDataController.name);

  constructor(private readonly erpDataService: ErpDataService) {}

  @Get('notas-pendentes') 
  async getNotasPendentes(): Promise<TGFCAB[]> {
    this.logger.log('Recebida requisição para GET /erp/notas-pendentes');
    return this.erpDataService.findNotasPendentes();
  }
}