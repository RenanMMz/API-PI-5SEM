import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class CreateUserDTO {
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    // @IsEmail() // Recomendado adicionar se quiser validar formato de email
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    senha: string;

    @ApiProperty({
        description: 'Master key hasheada (Senha mestra)',
        example: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxwKc.6...'
    })
    @IsString()
    @IsNotEmpty()
    nome: string;

    @ApiProperty({
        description: 'Master key hasheada (Senha mestra)',
        example: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxwKc.6...'
    })
    @IsString()
    @IsNotEmpty()
    tipo: string;

    @ApiProperty({
        description: 'KDF Salt (Plaintext chave pública do user)',
        example: 'a7f8e9d1c2b3a4...'
    })

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    kdfSalt: string;

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
    vaultTag: string;
}