import { Body, Controller, Post, Request } from '@nestjs/common';
import { CodigosService } from './codigos.service';
import { Codigo } from './codigos.entity';
import { RegistrarColetaDTO } from './dto/registrarColeta.dto';

@Controller('codigos')
export class CodigosController {

    constructor(private readonly codigosService: CodigosService) { }

    @Post('registrar')
    async criar(
        @Body() dto: RegistrarColetaDTO,
        @Request() req: any
    ): Promise<Codigo> {

        const usuarioId = req.user.id;

        return this.codigosService.registrar({...dto, usuarioId
        });
    }

    /*@Get()
    async listarTodos(): Promise<Codigo[]> {
        return this.codigosService.listarTodos();
    }

    @Get(':id')
    async buscarPorId(@Param('id', ParseIntPipe) id: number): Promise<Codigo> {
        return this.codigosService.buscarPorId(id);
    }

    @Patch(':id')
    async atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateCodigoDto,
    ): Promise<Codigo> {
        return this.codigosService.atualizar(id, updateDto);
    }

    @Delete(':id')
    async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.codigosService.remover(id);
    }*/

}