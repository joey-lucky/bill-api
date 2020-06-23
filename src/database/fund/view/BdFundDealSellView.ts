import {Column, ViewEntity} from "../../decorator";
import {BdFundDealSell} from "../entity/BdFundDealSell";

@ViewEntity({
    expression: `
select t.*,
       t1.value as fund_data_value
from bd_fund_deal_sell t
         left join bc_dict_data t1 on t1.code = t.data_status and t1.type_code = 'fund_data_status'
`,
})
export class BdFundDealSellView extends BdFundDealSell {
    @Column()
    dataStatusValue: string;
}
