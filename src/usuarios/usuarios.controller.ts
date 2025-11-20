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

  @Put('/update/:id')
  async updateUsuarios(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateUserDTO>,
  ) {
    const updatedUser = await this.usuariosService.updateUsuarios(id, updateData);
    if (!updatedUser) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return updatedUser;
  }
  
  @Get()
  async getUsuarios(): Promise<Usuario[]> {
    return this.usuariosService.getUsuarios();
  }
}
