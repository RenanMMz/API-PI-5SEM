import { Module } from "@nestjs/common";
import { TGFITEController } from "./tgfite.controller";
import { TGFITEService } from "./tgfite.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TGFITE } from "./tgfite.entity";

@Module({
    controllers: [TGFITEController],
    imports: [TypeOrmModule.forFeature([TGFITE])],
    providers: [TGFITEService],
    exports: [TGFITEService, TypeOrmModule.forFeature([TGFITE])],
})

export class TGFITEModule { };