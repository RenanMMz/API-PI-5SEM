import { Controller, Get } from "@nestjs/common";
import { TGFEST } from "./tgfest.entity";
import { TGFESTService } from "./tgfest.service";

@Controller('tgfest')
export class TGFESTController {
    constructor(private tgfestService: TGFESTService) { }

    @Get()
    getUsuarios(): Promise<TGFEST[]> {
        return this.tgfestService.getItens();
    }
}
