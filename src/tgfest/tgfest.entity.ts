import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { TGFDOCA } from "src/tgfdoca/tgfdoca.entity";

@Entity()
export class TGFEST {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    codigoBarra: string; // o código de barras em si

    @Column()
    codEmp: number; // FK Código da Empresa

    @Column({ type: 'int' })
    codProd: number; // PK Código do produto

    @Column()
    descrProd: string; // descrição do produto 

    @Column()
    codLocal: number; // FK Código do local

    @Column()
    codParc: number; // FK Código do parceiro

    @ManyToOne(() => TGFDOCA, { nullable: true }) // Muitos produtos em uma doca
    @JoinColumn ({ name: 'codDoca' })
    doca: TGFDOCA | null;

    @Column()
    estoqueMinimo: number;

    @Column()
    estoqueMaximo: number;

    @Column()
    estoqueAtual: number;

    @Column()
    dtVal: Date;

    


}