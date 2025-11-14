import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { TGFEST } from "./tgfest.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TGFESTService {
    constructor(
        @InjectRepository(TGFEST)
        private readonly tgfestRepo: Repository<TGFEST>
    ) { }

    async getItens() {
        return [];
    }
}