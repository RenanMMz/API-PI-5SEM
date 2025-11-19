import { Module } from "@nestjs/common";
import { UsuariosController } from "./usuarios.controller";
import { UsuariosService } from "./usuarios.service";
import { Usuario } from "./usuarios.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VaultDataModule } from "src/vaultData/vaultData.module";

@Module({
    controllers: [UsuariosController],
    imports: [
        TypeOrmModule.forFeature([Usuario]),
        VaultDataModule,
    ],
    providers: [UsuariosService],
    exports: [UsuariosService, TypeOrmModule.forFeature([Usuario])],
})

export class UsuariosModule {};