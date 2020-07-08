import {Column, DateTimeColumn, Entity, JoinColumn} from "../../decorator";
import {BaseEntity} from "../../base";
import {BeforeInsert, BeforeUpdate, Index, ManyToOne} from "typeorm";
import {BcFund} from "./BcFund";
import {Assert} from "../../../utils/Assert";

@Entity()
export class BdFundDealBuy extends BaseEntity {
    @Column({nullable: false})
    fundId: string;

    @DateTimeColumn({nullable: false, comment: "申请买入日期"})
    applyBuyDate: Date;

    @DateTimeColumn({comment: "买入日期"})
    buyDate: Date;

    @Column({nullable: false, type: "double", comment: "买入金额"})
    buyMoney: number;

    @Column({type: "double", default: 0, comment: "买入数量"})
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

    @Column({nullable: false, comment: "买入用户id"})
    @Index()
    userId: string;

    @ManyToOne(type => BcFund, {onDelete: "CASCADE", onUpdate: "NO ACTION"})
    @JoinColumn()
    fund: BcFund;

    @BeforeInsert()
    @BeforeUpdate()
    validate(){
        Assert.isTrue(this.buyMoney >= 10, "买入金额不大于10");
    }
}
