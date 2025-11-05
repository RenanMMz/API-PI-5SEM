import { TGFCAB } from "src/tgfcab/tgfcab.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TGFITE {
    @PrimaryGeneratedColumn()
    id: number; // PK Número Único da Nota

    @ManyToOne(() => TGFCAB, (cab) => cab.itens) // muitos itens para um cabeçalho
    @JoinColumn({ name: 'nunota', referencedColumnName: 'nunota' })
    cabecalho: TGFCAB;

    @Column()
    nunota: number; // FK do negócio

    @Column()
    sequencia: number; // PK sequência do item na nota

    @Column()
    codEmp: number; // FK Código da empresa

    @Column()
    codProd: number; // FK Código do produto

    @Column()
    qtdProd: number;
}