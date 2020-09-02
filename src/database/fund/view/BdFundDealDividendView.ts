import {Column, ViewEntity} from "../../decorator";
import {BdFundDealDividend} from "../..";

@ViewEntity({
    expression: `
select t.*,
       t1.value as dividend_type_value,
       t3.name  as fund_name
from bd_fund_deal_dividend t
         left join bc_dict_data t1 on t1.code = t.dividend_type and t1.type_code = 'fund_dividend_type'
         left join bd_fund_deal t2 on t2.id = t.fund_deal_id
         left join bc_fund t3 on t3.id = t2.fund_id
`,
})
export class BdFundDealDividendView extends BdFundDealDividend {
    @Column()
    dividendTypeValue: string;

    @Column()
    fundName: string;
}
