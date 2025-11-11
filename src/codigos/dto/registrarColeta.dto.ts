import { IsEnum, IsNotEmpty, IsNumber, IsString, IsBoolean } from "class-validator";

export class RegistrarColetaDTO {

    @IsString()
    @IsNotEmpty({ message: 'O numCodigo (código lido) é obrigatório' })
    numCodigo: string; 
    
    @IsEnum(['barcode', 'qrcode'], { message: 'O tipo deve ser "barcode" ou "qrcode"' })
    @IsNotEmpty()
    tipo: 'barcode' | 'qrcode';
    
    @IsNumber()
    @IsNotEmpty({ message: 'O nunota (ID da nota) é obrigatório' })
    nunota: number;

    @IsBoolean()
    confirmarDivergencia?: boolean;

}