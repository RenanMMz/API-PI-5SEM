import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TGFCAB {
    @PrimaryGeneratedColumn()
    id: number;
}