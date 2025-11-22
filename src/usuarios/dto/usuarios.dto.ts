import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class CreateUserDTO {
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    senha: string; // é a master key hasheada

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    kdfSalt: string; // plaintext chave pública do user

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    encryptedBlob: string; // blob com todas as senhas

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    vaultIV: string; //

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    vaultTag: string;

}