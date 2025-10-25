import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/db/database.module";
import { TGFITEController } from "./tgfest.controller";
import { tgfiteProviders } from "src/tgfite/tgfite.providers";
import { TGFITEService } from "src/tgfite/tgfite.service";

@Module({
    controllers: [TGFITEController],
    imports: [DatabaseModule],
    providers: [...tgfiteProviders, TGFITEService],
    exports: [...tgfiteProviders, TGFITEService],
})

export class TGFITEModule { };