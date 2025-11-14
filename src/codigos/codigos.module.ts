import { Module } from '@nestjs/common';
import { CodigosController } from './codigos.controller';
import { CodigosService } from './codigos.service';
import { DatabaseModule } from 'src/db/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Codigo } from './codigos.entity';
import { TGFESTModule } from 'src/tgfest/tgfest.module';
import { TGFITEModule } from 'src/tgfite/tgfite.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Codigo]),
    TGFESTModule,
    TGFITEModule,
    UsuariosModule,
  ],
  controllers: [CodigosController],
  providers: [CodigosService]
})
export class CodigosModule { }
