import {BaseView} from "../../base";
import {Column, ViewEntity} from "../../decorator";
import {BcFund} from "../entity/BcFund";

@ViewEntity({
    expression: `
select t.*,
       t1.name as fund_buss_type_name,
       t2.name as fund_type_name
from bc_fund t
         left join bc_fund_buss_type t1 on t1.id = t.fund_buss_type_id
         left join bc_fund_type t2 on t2.id = t.fund_type_id       
`,
})
export class BcFundView extends BcFund{
    @Column()
    fundBussTypeName: string;

    @Column()
    fundTypeName: string;
}
