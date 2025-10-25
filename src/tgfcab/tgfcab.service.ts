import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { TGFCAB } from "./tgfcab.entity";

@Injectable()
export class TGFCABService {
    constructor(
        @Inject('TGFCAB_REPOSITORY')
        private tgfcabRepo: Repository<TGFCAB>
    ) { }

    async getItens() {
        return [];
    }
}