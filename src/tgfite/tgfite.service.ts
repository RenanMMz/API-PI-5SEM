import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { TGFITE } from "./tgfite.entity";

@Injectable()
export class TGFITEService {
    constructor(
        @Inject('TGFITE_REPOSITORY')
        private tgfiteRepo: Repository<TGFITE>
    ) { }

    async getItens() {
        return [];
    }
}