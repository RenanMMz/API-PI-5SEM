import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
        enum: ['barcode','qrcode'],
    })
    tipo: TipoCodigo;

}