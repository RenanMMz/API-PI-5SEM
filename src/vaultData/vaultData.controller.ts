import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VaultDataService } from './vaultData.service';
import { VaultData } from './vaultData.entity';
import { createVaultDataDTO } from './dto/createVaultData.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('vaultdata')
export class VaultDataController {
  constructor(private vaultDataService: VaultDataService) { }

  @UseGuards(JwtAuthGuard)
  @Post ('/create')
  async createVaultData(
    @Req() req,
    @Body() createVaultDataDTO: createVaultDataDTO
  ): Promise<VaultData>{

    const userId = req.user.id;
    return this.vaultDataService.createVaultData(userId, createVaultDataDTO);

  }

}
