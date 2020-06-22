import {Column, DateTimeColumn, Entity, JoinColumn} from "../../decorator";
import {BaseEntity} from "../../base";
import {Index, ManyToOne, Unique} from "typeorm";
import {BcFund} from "./BcFund";

@Entity()
@Unique(["fundId","dateTime"])
export class BdFundIopv extends BaseEntity {
    @Column({nullable: false})
    fundId: string;

    @Column({type:"double"})
    iopv:number;

    @DateTimeColumn()
    @Index()
    dateTime: Date;

    @ManyToOne(type => BcFund, {onDelete: "CASCADE", onUpdate: "NO ACTION"})
    @JoinColumn()
    fund: BcFund;
}
