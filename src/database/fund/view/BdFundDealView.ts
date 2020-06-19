import {Column, ViewEntity} from "../../decorator";
import {BdFundDeal} from "../..";

@ViewEntity({
    expression: `
SELECT t.*,
       t1.code  AS fund_code,
       t1.name  AS fund_name,
       t2.name  AS user_name,
       t3.value AS status_value,
       t4.value AS data_status_value
FROM bd_fund_deal t
         LEFT JOIN bc_fund t1 ON t1.id = t.fund_id
         LEFT JOIN bc_user t2 ON t2.id = t.user_id
         LEFT JOIN bc_dict_data t3 ON t3.code = t.status AND t3.type_code = 'fund_deal_status'
         LEFT JOIN bc_dict_data t4 ON t4.code = t.data_status AND t4.type_code = 'fund_data_status'
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
