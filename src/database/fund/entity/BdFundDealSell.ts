import {Column, DateTimeColumn, Entity, JoinColumn} from "../../decorator";
import {BaseEntity} from "../../base";
import {ManyToOne} from "typeorm";
import {BdFundDeal} from "./BdFundDeal";

@Entity()
export class BdFundDealSell extends BaseEntity {
    @Column({nullable: false, comment: "买入记录ID"})
    fundDealId: string;

    @DateTimeColumn({nullable: false, comment: "申请卖出日期"})
    applySellDate: Date;

    @DateTimeColumn({comment: "卖出日期"})
    sellDate: Date;

    @Column({nullable: false, type: "double", comment: "卖出数量"})
    sellCount: number;

    @Column({type: "double", comment: "卖出单价"})
    sellPrice: number;

    @Column({type: "double", comment: "卖出金额"})
    sellMoney: number;

    @Column({type: "double", comment: "卖出手续费"})
    sellCommission: number;

    @Column({type: "double", comment: "盈利"})
    profitMoney: number;

    @Column({type: "double", comment: "数据状态，关联字典fund_data_status"})
    dataStatus: string;

    @Column({type: "double", comment: "盈利比"})
    profitRadio: number;

    @ManyToOne(type => BdFundDeal, {onDelete: "CASCADE", onUpdate: "NO ACTION"})
    @JoinColumn()
    fundDeal: BdFundDeal;
}
