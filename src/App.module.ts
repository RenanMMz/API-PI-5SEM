import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './db/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CodigosModule } from './codigos/codigos.module';

@Module({
  imports: [
    DatabaseModule,
    UsuariosModule,
    CodigosModule,
    AuthModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CodigosModule,
  ],
})
export class AppModule {}
