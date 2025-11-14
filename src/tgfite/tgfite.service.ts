import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { TGFITE } from "./tgfite.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TGFITEService {
    constructor(
        @InjectRepository(TGFITE)
        private readonly tgfiteRepository: Repository<TGFITE>
    ) { }

    async getItens() {
        return [];
    }
}