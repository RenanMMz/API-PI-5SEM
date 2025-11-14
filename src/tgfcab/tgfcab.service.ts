import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { TGFCAB } from "./tgfcab.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TGFCABService {

    constructor(
        @InjectRepository(TGFCAB)
        private readonly tgfcabRepository: Repository<TGFCAB>) {
    }

    async getItens() {
        return [];
    }
}