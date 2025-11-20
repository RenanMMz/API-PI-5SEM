import { Module } from "@nestjs/common";
import { UsuariosController } from "./usuarios.controller";
import { UsuariosService } from "./usuarios.service";
import { Usuario } from "./usuarios.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VaultData } from "src/vaultData/vaultData.entity";

@Module({
    controllers: [UsuariosController],
    imports: [
        TypeOrmModule.forFeature([Usuario, VaultData]),
    ],
    providers: [UsuariosService],
    exports: [UsuariosService, TypeOrmModule.forFeature([Usuario])],
})

export class UsuariosModule {};