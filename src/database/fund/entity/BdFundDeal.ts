import {Column, DateTimeColumn, Entity, JoinColumn} from "../../decorator";
import {BaseEntity} from "../../base";
import {BeforeInsert, BeforeUpdate, Index, ManyToOne, OneToMany} from "typeorm";
import {BcFund} from "./BcFund";
import {Assert} from "../../../utils/Assert";
import {BdFundDealSell} from "./BdFundDealSell";

@Entity()
export class BdFundDeal extends BaseEntity {
    @Column({nullable: false})
    fundId: string;

    @DateTimeColumn({nullable: false, comment: "申请买入日期"})
    applyBuyDate: Date;

    @DateTimeColumn({comment: "买入日期"})
    buyDate: Date;

    @Column({nullable: false, type: "double", comment: "买入金额"})
    buyMoney: number;

    @Column({type: "double", default: 0, comment: "买入份额"})
    buyCount: number;

    @Column({type: "double", comment: "买入价格"})
    buyPrice: number;

    @Column({type: "double", comment: "买入手续费"})
    buyCommission: number;

    @Column({nullable: false, default: "0", comment: "数据状态，关联字典fund_data_status"})
    @Index()
    dataStatus: string;

    @Column({nullable: false, default: "0", comment: "记录状态，关联字典fund_deal_status"})
    @Index()
    status: string;

    @Column({nullable: false, type: "double", default: 0, comment: "合计卖出份额"})
    totalSellCount: string;

    @Column({nullable: false, type: "double", default: 0, comment: "合计卖出金额"})
    totalSellMoney: number;

    @Column({nullable: false, type: "double", default: 0, comment: "合计卖出手续费"})
    totalSellCommission: number;

    @Column({nullable: false, type: "double", default: 0, comment: "剩余份额"})
    remainCount: number;

    @Column({nullable: false, type: "double", default: 0, comment: "市值"})
    marketValue: number;

    @Column({nullable: false, type: "double", default: 0, comment: "盈利比例"})
    profitRadio: number;

    @Column({nullable: false, type: "double", default: 0, comment: "盈利金额"})
    profitMoney: number;

    @Column({nullable: false, comment: "买入用户id"})
    @Index()
    userId: string;

    @ManyToOne(type => BcFund, {onDelete: "CASCADE", onUpdate: "NO ACTION"})
    @JoinColumn()
    fund: BcFund;
}
