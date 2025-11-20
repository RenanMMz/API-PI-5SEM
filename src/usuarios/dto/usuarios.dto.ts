import { ApiProperty } from "@nestjs/swagger"; // <--- Importação necessária
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class CreateUserDTO {
    
    @ApiProperty({
        description: 'Email do usuário para login',
        example: 'teste@fatec.sp.gov.br'
    })
    @IsString()
    @IsNotEmpty()
    // @IsEmail() // Recomendado adicionar se quiser validar formato de email
    email: string;

    @ApiProperty({
        description: 'Master key hasheada (Senha mestra)',
        example: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxwKc.6...'
    })
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

    @IsString()
    @IsNotEmpty()
    kdfSalt: string;

    @ApiProperty({
        description: 'Blob criptografado contendo todas as senhas',
        example: 'U2FsdGVkX1+...'
    })
    @IsString()
    @IsNotEmpty()
    encryptedBlob: string;

    @ApiProperty({
        description: 'Vetor de inicialização (IV) do Vault',
        example: 'iv123456789'
    })
    @IsString()
    @IsNotEmpty()
    vaultIV: string;

    @ApiProperty({
        description: 'Tag de autenticação do Vault (Auth Tag)',
        example: 'tagXYZ123'
    })
    @IsString()
    @IsNotEmpty()
    vaultTag: string;
}