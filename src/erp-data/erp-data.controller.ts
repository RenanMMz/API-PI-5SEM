import { Controller, Get, UseGuards, Logger, Post, Request } from '@nestjs/common';
import { ErpDataService } from './erp-data.service';
import { TGFCAB } from 'src/tgfcab/tgfcab.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('erp')
export class ErpDataController {
  private readonly logger = new Logger(ErpDataController.name);

  constructor(private readonly erpDataService: ErpDataService) {}

  @Get('notas-pendentes') 
  @UseGuards(JwtAuthGuard)
  async getNotasPendentes(): Promise<TGFCAB[]> {
    this.logger.log('Recebida requisição para GET /erp/notas-pendentes');
    return this.erpDataService.findNotasPendentes();
  }

  @Post('iniciar-coleta')
  @UseGuards(JwtAuthGuard)
  async iniciarColeta(@Request() req: any) {
    

    const usuarioId = req.user.id;
    
    return this.erpDataService.atribuirProximaNota(usuarioId);
  }

}