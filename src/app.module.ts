import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './db/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CodigosModule } from './codigos/codigos.module';
import { TGFCABModule } from './tgfcab/tgfcab.module';
import { TGFITEModule } from './tgfite/tgfite.module';
import { TGFESTModule } from './tgfest/tgfest.module';
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [
    DatabaseModule,
    UsuariosModule,
    CodigosModule,
    AuthModule,
    TGFCABModule,
    TGFITEModule,
    TGFESTModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CodigosModule,
    SeedModule,
  ],
})
export class AppModule { }
