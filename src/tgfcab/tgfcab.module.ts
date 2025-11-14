import { Module } from "@nestjs/common";
import { TGFCABController } from "./tgfcab.controller";
import { TGFCABService } from "./tgfcab.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TGFCAB } from "./tgfcab.entity";

@Module({
    controllers: [TGFCABController],
    imports: [TypeOrmModule.forFeature([TGFCAB])],
    providers: [TGFCABService],
    exports: [TGFCABService, TypeOrmModule.forFeature([TGFCAB])],
})

export class TGFCABModule { };