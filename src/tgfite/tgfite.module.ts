import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/db/database.module";
import { TGFITEController } from "./tgfite.controller";
import { tgfiteProviders } from "./tgfite.providers";
import { TGFITEService } from "./tgfite.service";

@Module({
    controllers: [TGFITEController],
    imports: [DatabaseModule],
    providers: [...tgfiteProviders, TGFITEService],
    exports: [...tgfiteProviders, TGFITEService],
})

export class TGFITEModule { };