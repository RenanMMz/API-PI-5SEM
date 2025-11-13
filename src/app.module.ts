import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CodigosModule } from './codigos/codigos.module';
import { TGFCABModule } from './tgfcab/tgfcab.module';
import { TGFITEModule } from './tgfite/tgfite.module';
import { TGFESTModule } from './tgfest/tgfest.module';
import { SeedModule } from './seed/seed.module';
import { ErpDataModule } from './erp-data/erp-data.module';
import { TgfdocaModule } from './tgfdoca/tgfdoca.module';
import { RecebimentoModule } from './recebimento/recebimento.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'process';


@Module({
  imports: [
    //precisa ficar no topo, o typeormmodule depende do configmodule
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      })
    }),
    UsuariosModule,
    CodigosModule,
    AuthModule,
    TGFCABModule,
    TGFITEModule,
    TGFESTModule,
    RecebimentoModule,
    ScheduleModule.forRoot(),
    SeedModule,
    ErpDataModule,
    TgfdocaModule,
  ],
})
export class AppModule { }
