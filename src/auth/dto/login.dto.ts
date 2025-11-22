import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'O campo nome é obrigatório' })
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'O campo senha é obrigatório' })
    senha: string;
}