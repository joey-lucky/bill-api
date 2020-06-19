import {Column, DateTimeColumn, Entity} from "../../decorator";
import {BaseEntity} from "../../base";

@Entity()
export class BdFundIopv extends BaseEntity {
    @Column()
    code: string;

    @Column({type:"double"})
    iopv;

    @DateTimeColumn()
    dateTime: Date;
}
