import { VaultData } from "../vaultData/vaultData.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    nome: string;    
    
    @Column()
    senha: string;

    @Column()
    kdfSalt: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    criadoEm: Date;

    @Column()
    tipo: string;    
   
    @Column('simple-array')
    reservas: string[];    
   
    @Column('simple-array')
    cartoes: string[];    
    
    @OneToOne(() => VaultData, vaultData => vaultData.usuario)
    vaultData: VaultData;

}