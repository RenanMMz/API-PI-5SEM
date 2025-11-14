import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecebimentoService } from './recebimento.service';
import { RecebimentoController } from './recebimento.controller';
import { TGFREC } from 'src/tgfrec/tgfrec.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { TgfdocaModule } from 'src/tgfdoca/tgfdoca.module';
import { TGFESTModule } from 'src/tgfest/tgfest.module';
import { TGFITEModule } from 'src/tgfite/tgfite.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([TGFREC]),

    UsuariosModule,
    TgfdocaModule,
    TGFESTModule,
    TGFITEModule
  ],
  controllers: [RecebimentoController],
  providers: [RecebimentoService],
  exports: [RecebimentoService],
})
export class RecebimentoModule { }