import { Body, Controller, Post, Request } from '@nestjs/common';
import { CodigosService } from './codigos.service';
import { Codigo } from './codigos.entity';
import { RegistrarColetaDTO } from './dto/registrarColeta.dto';

@Controller('codigos')
export class CodigosController {

    constructor(private readonly codigosService: CodigosService) { }


}