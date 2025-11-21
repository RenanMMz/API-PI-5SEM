import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class UpdateUserDTO {
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    novaSenha: string; // é a master key hasheada

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    novoKdfSalt: string; // plaintext chave pública do user

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    novoEncryptedBlob: string; // blob com todas as senhas

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    novoVaultIV: string; //

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    novoVaultTag: string;

}