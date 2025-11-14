import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RecebimentoService } from './recebimento.service';
import { RegistrarRecebimentoDTO } from '../recebimento/dto/registrarRecebimento.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('recebimento')
export class RecebimentoController {
  constructor(private readonly recebimentoService: RecebimentoService) {}

  @Post('registrar')
  async registrar(
    @Body() dto: RegistrarRecebimentoDTO,
    @Request() req: any,
  ) {
    const usuarioId = req.user.id;
    
    return this.recebimentoService.registrarRecebimento(dto, usuarioId);
  }
}