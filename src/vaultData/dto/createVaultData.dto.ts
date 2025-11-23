import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class createVaultDataDTO {
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    encryptedBlob: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    vaultIV: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    vaultTag: string

}