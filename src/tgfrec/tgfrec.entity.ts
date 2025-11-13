import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { TGFDOCA } from "src/tgfdoca/tgfdoca.entity";
import { TGFEST } from "src/tgfest/tgfest.entity";
import { Usuario } from "src/usuarios/usuarios.entity";

@Entity()
export class TGFREC {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TGFDOCA)
    @JoinColumn({ name: 'codDoca' })
    doca: TGFDOCA;

    @ManyToOne(() => TGFEST)
    @JoinColumn({ name: 'CODPROD' })
    produto: TGFEST;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario;

    @Column({ type: 'decimal', default: 0 })
    qtdContada: number;

    @Column({ type: 'decimal', default: 0 })
    qtdAvariada: number;

    @Column()
    nunotaOrigem: number;

    @CreateDateColumn()
    dataRecebimento: Date;

    @Column({ length: 50, default: 'AGUARDANDO_CONFERENCIA' })
    statusRecebimento: string;

    @Column({ default: false })
    divergente: boolean;
    
}