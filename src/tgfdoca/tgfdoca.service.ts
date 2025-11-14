import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TGFDOCA } from './tgfdoca.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TgfdocaService {
    constructor(@InjectRepository(TGFDOCA)
private readonly tgfdocaRepository: Repository<TGFDOCA>) {}

}
