import { Controller, Get } from "@nestjs/common";
import { TGFEST } from "./tgfest.entity";
import { TGFESTService } from "./tgfest.service";

@Controller('tgfite')
export class TGFITEController {
    constructor(private tgfestService: TGFESTService) { }

    @Get()
    getUsuarios(): Promise<TGFEST[]> {
        return this.tgfestService.getItens();
    }
}
