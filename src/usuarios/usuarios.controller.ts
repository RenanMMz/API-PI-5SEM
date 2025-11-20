import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUserDTO } from './dto/usuarios.dto';
import { Usuario } from './usuarios.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) { }

  @Post('/create')
  createUsuarios(@Body() createUserDTO: CreateUserDTO) {
    return this.usuariosService.createUsuarios(createUserDTO);
  }
}
