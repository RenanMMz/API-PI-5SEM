import { Codigo } from "src/codigos/codigos.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    
    @Column({ unique: true })
    email: string;

    @Column()
    senha: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    criadoEm: Date;
    
    @Column()
    tipo: string;

    @OneToMany(() => Codigo, codigo => codigo.usuario)
    coletas: Codigo[];

}