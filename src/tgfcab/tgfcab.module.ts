import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/db/database.module";
import { TGFCABController } from "./tgfcab.controller";
import { tgfcabProviders } from "./tgfcab.providers";
import { TGFCABService } from "./tgfcab.service";

@Module({
    controllers: [TGFCABController],
    imports: [DatabaseModule],
    providers: [...tgfcabProviders, TGFCABService],
    exports: [...tgfcabProviders, TGFCABService],
})

export class TGFCABModule { };