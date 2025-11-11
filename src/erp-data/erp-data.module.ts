import { Module } from '@nestjs/common';
import { ErpDataController } from 'src/erp-data/erp-data.controller';
import { ErpDataService } from 'src/erp-data/erp-data.service';
import { DatabaseModule } from 'src/db/database.module'; 
import { AuthModule } from 'src/auth/auth.module'; 
import { JwtModule } from '@nestjs/jwt'; 

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'EcksDee',
    }),
  ],
  controllers: [ErpDataController],
  providers: [ErpDataService],
})
export class ErpDataModule {}