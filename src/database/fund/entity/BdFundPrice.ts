import {Column, DateTimeColumn, Entity, JoinColumn} from "../../decorator";
import {BaseEntity} from "../../base";
import {Index, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {BcFund} from "./BcFund";

@Entity()
@Unique(["fundId","dateTime"])
export class BdFundPrice extends BaseEntity {
    @Column({nullable: false})
    fundId: string;

    @Column({type:"double"})
    price:number;

    @Column({type:"double",nullable:false})
    increase: number;

    @DateTimeColumn()
    @Index()
    dateTime: Date;

    @ManyToOne(type => BcFund, {onDelete: "CASCADE", onUpdate: "NO ACTION"})
    @JoinColumn()
    fund: BcFund;
}