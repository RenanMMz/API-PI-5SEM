export class CreateCodigoDTO {
    numero: String;
    tipo: 'barcode' | 'qrcode';
    usuarioId: number;
}