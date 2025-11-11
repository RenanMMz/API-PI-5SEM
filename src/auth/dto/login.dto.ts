import { IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {

    @IsString()
    @IsNotEmpty({ message: 'O campo nome é obrigatório' })
    nome: string;

    @IsString()
    @IsNotEmpty({ message: 'O campo senha é obrigatório' })
    senha: string;
}