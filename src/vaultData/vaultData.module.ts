import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VaultDataService } from "./vaultData.service";
import { VaultDataController } from "./vaultData.controller";
import { VaultData } from "./vaultData.entity";
import { Usuario } from "src/usuarios/usuarios.entity";
import { DataSource } from "typeorm";

@Module({
    controllers: [VaultDataController],
    imports: [
        TypeOrmModule.forFeature([VaultData, Usuario]),
    ],
    providers: [VaultDataService, {provide: DataSource, useExisting: DataSource}],
    exports: [VaultDataService, TypeOrmModule.forFeature([VaultData])],
})

export class VaultDataModule {};