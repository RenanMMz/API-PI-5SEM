    import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

    @Entity()
    export class TGFEST {

        @PrimaryGeneratedColumn()
        id: number;

        @Column({unique:true})
        codigoBarra: string; // o código de barras em si

        @Column()
        codEmp: number; // FK Código da Empresa

        @Column({type: 'int'})
        codProd: number; // PK Código do produto

        @Column()
        descrProd: string; // descrição do produto 

        @Column()
        codLocal: number; // FK Código do local

        @Column()
        codParc: number; // FK Código do parceiro

        @Column()
        estoqueMinimo: number;

        @Column()
        estoqueMaximo: number;

        @Column()
        estoqueAtual: number;

        @Column()
        dtVal: Date;



    }