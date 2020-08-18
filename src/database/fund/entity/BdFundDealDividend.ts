import {Column, DateTimeColumn, Entity} from "../../decorator";
import {BaseEntity} from "../../base";

@Entity()
export class BdFundDealDividend extends BaseEntity {
    @Column({nullable: false, comment: "买入记录ID"})
    fundDealId: string;

    @Column({nullable: false, type: "double", comment: "分红金额"})
    dividendMoney: number;

    @DateTimeColumn({nullable: false, comment: "分红日期"})
    dividendDate: Date;

    @Column({nullable: false, type: "double", comment: "分红买入份额"})
    buyCount: number;

    @DateTimeColumn({nullable: false, comment: "买入日期"})
    buyDate: Date;

    @Column({nullable: false, comment: "分红类型，关联字典fund_dividend_type"})
    dividendType: string;
}
