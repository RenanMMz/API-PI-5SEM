export class createUserDTO {
    
    email: string;
    senha: string; // é a master key hasheada
    kdfSalt: string; // plaintext chave pública do user
    encryptedBlob: string; // blob com todas as senhas
    vaultIv: string; // 
    vaultTag: string;

}