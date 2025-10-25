import {
    Controller,
    Get,
} from '@nestjs/common';
import { TGFITEService } from './tgfite.service';
import { TGFITE } from './tgfite.entity';

@Controller('tgfite')
export class TGFITEController {
    constructor(private tgfiteService: TGFITEService) { }

    @Get()
    getUsuarios(): Promise<TGFITE[]> {
        return this.tgfiteService.getItens();
    }
}
