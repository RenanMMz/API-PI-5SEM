import { IsNotEmpty, IsString } from "class-validator";

export class createVaultDataDTO {
    
    @IsString()
    @IsNotEmpty()
    encryptedBlob: string;

    @IsString()
    @IsNotEmpty()
    vaultIV: string;
    
    @IsString()
    @IsNotEmpty()
    vaultTag: string

}