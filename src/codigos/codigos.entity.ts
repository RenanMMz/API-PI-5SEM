import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Codigo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    numero: string; // o número do código

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    criadoEm: Date;
    
    @Column()
    tipo: string; // código de barras 'barcode' ou QR Code 'qr'

}