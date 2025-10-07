import { Module } from '@nestjs/common';
import { CodigosController } from './codigos.controller';
import { CodigosService } from './codigos.service';
import { DatabaseModule } from 'src/db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CodigosController],
  providers: [CodigosService]
})
export class CodigosModule {}
