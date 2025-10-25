import { Controller, Get } from "@nestjs/common";
import { TGFCAB } from "./tgfcab.entity";
import { TGFCABService } from "./tgfcab.service";

@Controller('tgfcab')
export class TGFCABController {
    constructor(private tgfcabService: TGFCABService) { }

    @Get()
    getUsuarios(): Promise<TGFCAB[]> {
        return this.tgfcabService.getItens();
    }
}
