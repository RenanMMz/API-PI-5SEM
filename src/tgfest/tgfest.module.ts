import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/db/database.module";
import { TGFESTController } from "./tgfest.controller";
import { tgfiteProviders } from "src/tgfite/tgfite.providers";
import { TGFITEService } from "src/tgfite/tgfite.service";

@Module({
    controllers: [TGFESTController],
    imports: [DatabaseModule],
    providers: [...tgfiteProviders, TGFITEService],
    exports: [...tgfiteProviders, TGFITEService],
})

export class TGFESTModule { };