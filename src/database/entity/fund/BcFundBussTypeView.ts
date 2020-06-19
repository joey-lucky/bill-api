import {Column, ViewEntity} from "../../decorator";
import {BcFundBussType} from "./BcFundBussType";

@ViewEntity({
    expression: `
select t.*,
       t1.name  as fund_type_name,
       p_t.name as parent_name
from bc_fund_buss_type t
         left join bc_fund_type t1 on t1.id = t.fund_type_id
         left join bc_fund_buss_type p_t on p_t.id = t.parent_id
`,
})
export class BcFundBussTypeView extends BcFundBussType {
    @Column()
    parentName: string;

    @Column()
    fundTypeName: string;
}
