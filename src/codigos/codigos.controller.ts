import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CodigosService } from './codigos.service';
import { Codigo } from './codigos.entity';
import { RegistrarColetaDTO } from './dto/registrarColeta.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('codigos')
export class CodigosController {

    constructor(private readonly codigosService: CodigosService) { }
    @Post('registrar')
    @UseGuards(JwtAuthGuard)
    async criar(
        @Body() dto: RegistrarColetaDTO,
        @Request() req:any
    ): Promise<Codigo> {

        const usuarioId = req.user.id;



        return this.codigosService.registrar(dto, usuarioId);
    }


}