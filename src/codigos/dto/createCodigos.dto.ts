export class CreateCodigoDTO {

    numCodigo: string;
    tipo: 'barcode' | 'qrcode';
    usuarioId: number;
}