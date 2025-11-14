import { Module } from "@nestjs/common";
import { TGFESTController } from "./tgfest.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TGFEST } from "./tgfest.entity";
import { TGFESTService } from "./tgfest.service";

@Module({
    controllers: [TGFESTController],
    imports: [TypeOrmModule.forFeature([TGFEST])],
    providers: [TGFESTService],
    exports: [TGFESTService, TypeOrmModule.forFeature([TGFEST])],
})

export class TGFESTModule { };