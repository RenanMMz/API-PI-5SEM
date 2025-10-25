import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/db/database.module";
import { TGFESTController } from "./tgfest.controller";
import { TGFESTService } from "./tgfest.service";
import { tgfestProviders } from "./tgfest.providers";

@Module({
    controllers: [TGFESTController],
    imports: [DatabaseModule],
    providers: [...tgfestProviders, TGFESTService],
    exports: [...tgfestProviders, TGFESTService],
})

export class TGFESTModule { };