import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TGFEST {
    @PrimaryGeneratedColumn()
    id: number;
}