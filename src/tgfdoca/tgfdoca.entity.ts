import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TGFDOCA {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    codDoca: number;

    @Column()
    descrDoca: string;

}