import {Column, ViewEntity} from "../../decorator";
import {BdFundDealSell} from "../..";

@ViewEntity({
    expression: `
select t.*,
       t1.value as data_status_value,
       t3.name  as fund_name
from bd_fund_deal_sell t
         left join bc_dict_data t1 on t1.code = t.data_status and t1.type_code = 'fund_data_status'
         left join bd_fund_deal t2 on t2.id = t.fund_deal_id
         left join bc_fund t3 on t3.id = t2.fund_id
`,
})
export class BdFundDealSellView extends BdFundDealSell {
    @Column()
    dataStatusValue: string;

    @Column()
    fundName: string;
}
