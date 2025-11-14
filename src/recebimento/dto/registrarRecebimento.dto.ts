import { IsNumber, IsNotEmpty, IsString, IsEnum, Min, IsOptional, IsBoolean } from 'class-validator';

export class RegistrarRecebimentoDTO {
    
    @IsNumber()
    @IsNotEmpty({ message: 'O NUNOTA da nota de recebimento é obrigatório.' })
    nunota: number;

    @IsNumber()
    @IsNotEmpty({ message: 'O código da doca (CODDOCA) é obrigatório.' })
    codDoca: number;

    @IsString()
    @IsNotEmpty({ message: 'O numCodigo (código lido) é obrigatório.' })
    numCodigo: string; // Código de barras do produto

    @IsNumber()
    @IsNotEmpty({ message: 'A quantidade contada é obrigatória.' })
    @Min(1, { message: 'A quantidade contada deve ser no mínimo 1.' })
    qtdContada: number;

    @IsNumber()
    @Min(0, { message: 'A quantidade avariada não pode ser negativa.' })
    qtdAvariada: number = 0;

    @IsBoolean()
    @IsOptional()
    confirmarDivergencia?: boolean = false;
}