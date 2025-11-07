import { TGFITE } from "src/tgfite/tgfite.entity";
import { Usuario } from "src/usuarios/usuarios.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TGFCAB {

    @PrimaryGeneratedColumn()
    id: number; // PK Número único da nota

    @Column({ unique: true })
    nunota: number; // PK da negociação

    @Column()
    codEmp: number; // FK Código da Empresa

    @Column()
    statusNota: string; // status da nota 'pendente' ou 'concluído'

    @ManyToOne(() => Usuario, { nullable: true }) // Uma nota pode ser de um usuário
    @JoinColumn({ name: 'idUsuarioColeta' }) // Chave estrangeira
    usuarioColeta: Usuario;

    @Column()
    nunNota: string; // número da nota

    @Column()
    codParc: number; // Código do Parceiro

    @OneToMany(() => TGFITE, (item) => item.cabecalho) // um cabeçalho tem muitos itens
    itens: TGFITE[];

}