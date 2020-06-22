import {Column, Entity, JoinColumn} from "../../decorator";
import {BaseEntity} from "../../base";
import {ManyToOne} from "typeorm";
import {BcFundType} from "./BcFundType";
import {BcFund} from "./BcFund";

@Entity()
export class BcFundSellCommission extends BaseEntity {
    @Column({nullable: false, type: "int"})
    lessThanDay: number;

    @Column({nullable: false, type: "double"})
    commission;

    @Column({nullable: false})
    fundId: string;

    @ManyToOne(type => BcFund, {onDelete: "CASCADE", onUpdate: "NO ACTION"})
    @JoinColumn()
    fund: BcFund;
}
