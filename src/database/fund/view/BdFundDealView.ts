import {Column, ViewEntity} from "../../decorator";
import {BdFundDeal} from "../..";

@ViewEntity({
    expression: `
select t.*,
       t1.code  as fund_code,
       t1.name  as fund_name,
       t2.name  as user_name,
       t3.value as status_value,
       t4.value as data_status_value
from bd_fund_deal t
         left join bc_fund t1 on t1.id = t.fund_id
         left join bc_user t2 on t2.id = t.user_id
         left join bc_dict_data t3 on t3.code = t.status and t3.type_code = 'fund_deal_status'
         left join bc_dict_data t4 on t4.code = t.data_status and t4.type_code = 'fund_data_status'
`,
})
export class BdFundDealView extends BdFundDeal {
    @Column()
    fundCode: string;

    @Column()
    fundName: string;

    @Column()
    statusValue: string;

    @Column()
    dataStatusValue: string;
}
