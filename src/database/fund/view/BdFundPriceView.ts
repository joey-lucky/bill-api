import {Column, ViewEntity} from "../../decorator";
import {BdFundPrice} from "../..";

@ViewEntity({
    expression: `
select t.*,
       t1.code as fund_code,
       t1.name as fund_name
from bd_fund_price t
         left join bc_fund t1 on t1.id = t.fund_id`,
})
export class BdFundPriceView extends BdFundPrice {
    @Column()
    fundCode: string;

    @Column()
    fundName: string;
}
