import { Module } from '@nestjs/common';
import { TgfdocaService } from './tgfdoca.service';
import { TGFDOCA } from './tgfdoca.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([TGFDOCA])],
  providers: [TgfdocaService],
  exports: [TgfdocaService, TypeOrmModule.forFeature([TGFDOCA])],
})
export class TgfdocaModule {}
