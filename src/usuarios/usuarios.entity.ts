import { VaultData } from "../vaultData/vaultData.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string; 
    
    @Column()
    senha: string;

    @Column()
    kdfSalt: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    criadoEm: Date;
    
    @OneToOne(() => VaultData, vaultData => vaultData.usuario)
    vaultData: VaultData;

}