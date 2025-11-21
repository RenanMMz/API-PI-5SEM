import { Usuario } from "src/usuarios/usuarios.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VaultData {
    
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Usuario, {onDelete: 'CASCADE'}) // FK de usuario, 
    @JoinColumn()
    usuario: Usuario;

    @Column()
    encryptedBlob: string;

    @Column()
    vaultIV: string;

    @Column()
    vaultTag: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    criadoEm: Date;

}