import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { TGFEST } from "./tgfest.entity";

@Injectable()
export class TGFESTService {
    constructor(
        @Inject('TGFEST_REPOSITORY')
        private tgfestRepo: Repository<TGFEST>
    ) { }

    async getItens() {
        return [];
    }
}