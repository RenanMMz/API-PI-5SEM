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
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { VaultDataService } from './vaultData.service';
import { VaultData } from './vaultData.entity';
import { createVaultDataDTO } from './dto/createVaultData.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('vaultdata')
export class VaultDataController {
  constructor(private vaultDataService: VaultDataService) { }

  //get do vaultdata (vem no login mas tá aqui também idk)
  @Get()
  async getVaultData(@Req() req) {
    const userId = req.user.id;
    const vaultData = await this.vaultDataService.getVaultDataByUserId(userId);
    if (!vaultData) {
      throw new NotFoundException('VaultData não encontrado');
    }
    // Retorna os dados criptografados do vault
    return {
      encryptedBlob: vaultData.encryptedBlob,
      vaultIV: vaultData.vaultIV,
      vaultTag: vaultData.vaultTag,
    };
  }

  //update de senhas (O cliente envia o novo blob criptografado)
  @Put()
  async updateVaultData(
    @Req() req,
    @Body() updateData: Partial<createVaultDataDTO>,
  ): Promise<{ message: string }> {
    const userId = req.user.id;

    if (!updateData.encryptedBlob || !updateData.vaultIV || !updateData.vaultTag) {
      throw new BadRequestException('Dados de atualização incompletos.');
    }

    await this.vaultDataService.updateVaultData(userId, updateData);
    return { message: 'VaultData atualizado com sucesso' };
  }

  @Delete()
  async deleteAccount(@Req() req): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.vaultDataService.deleteAccountAndVault(userId);
    return { message: 'Conta e VaultData deletados com sucesso' };
  }


}
