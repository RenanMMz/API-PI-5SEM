import { TGFITE } from "src/tgfite/tgfite.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    nunNota: string; // número da nota

    @Column()
    codParc: number; // Código do Parceiro

    @OneToMany(() => TGFITE, (item) => item.cabecalho) // um cabeçalho tem muitos itens
    itens: TGFITE[];

}