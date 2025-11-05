import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "src/usuarios/usuarios.entity";

export type TipoCodigo = 'barcode' | 'qrcode';

@Entity()
export class Codigo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    numCodigo: string;

    @ManyToOne(() => Usuario, usuario => usuario.coletas)
    usuario: Usuario;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    criadoEm: Date;

    @Column({
        type: 'enum',
        enum: ['barcode', 'qrcode'],
    })
    tipo: TipoCodigo;

    @Column()
    nunota: number; // o Número Único da nota que está sendo coletada

    @Column()
    codProd: number; // código do produto que foi identificado

}