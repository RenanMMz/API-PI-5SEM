import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CodigosService } from './codigos.service';
import { Codigo } from './codigos.entity';
import { CreateCodigoDTO } from './dto/createCodigos.dto';
import { UpdateCodigoDto } from './dto/updateCodigos.dto';

@Controller('codigos')
export class CodigosController {

    constructor(private readonly codigosService: CodigosService) { }

    @Post()
    async criar(@Body() createCodigoDTO: CreateCodigoDTO): Promise<Codigo> {
        return this.codigosService.criar(createCodigoDTO);
    }

    @Get()
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
    }

}