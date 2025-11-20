import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VaultDataModule } from './vaultData/vaultData.module';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [
    //precisa ficar no topo, o typeormmodule depende do configmodule
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule, 
    UsuariosModule,
    VaultDataModule,
    AuthModule,
    ScheduleModule.forRoot(),

  ],

})
export class AppModule { }
