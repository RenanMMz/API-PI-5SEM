import { IsNotEmpty, IsString } from "class-validator";


export class CreateUserDTO {
    
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    senha: string; // é a master key hasheada

    @IsString()
    @IsNotEmpty()
    kdfSalt: string; // plaintext chave pública do user

    @IsString()
    @IsNotEmpty()
    encryptedBlob: string; // blob com todas as senhas

    @IsString()
    @IsNotEmpty()
    vaultIV: string; //

    @IsString()
    @IsNotEmpty()
    vaultTag: string;

}