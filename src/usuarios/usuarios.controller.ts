import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUserDTO } from './dto/usuarios.dto';
import { Usuario } from './usuarios.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDTO } from './dto/updateUsuarios.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) { }

  @Post('/create')
  async createUsuarios(@Body() createUserDTO: CreateUserDTO) {
    return this.usuariosService.createUsuarios(createUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update')
  async updateUsuarios(
    @Req() req,
    @Body() updateData: UpdateUserDTO,
  ){
    const userId = req.user.id;

    await this.usuariosService.updateUser(
      userId,
      updateData
    );

    return { message: 'Senha e Vault atualizados com sucesso'};
  }

}
