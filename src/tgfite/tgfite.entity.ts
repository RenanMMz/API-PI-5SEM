import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TGFITE {
    @PrimaryGeneratedColumn()
    id: number;
}