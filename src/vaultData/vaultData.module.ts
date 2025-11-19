import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VaultDataService } from "./vaultData.service";
import { VaultDataController } from "./vaultData.controller";
import { VaultData } from "./vaultData.entity";
import { UsuariosModule } from "src/usuarios/usuarios.module";

@Module({
    controllers: [VaultDataController],
    imports: [
        TypeOrmModule.forFeature([VaultData]),
        UsuariosModule,
    ],
    providers: [VaultDataService],
    exports: [VaultDataService, TypeOrmModule.forFeature([VaultData])],
})

export class VaultDataModule {};