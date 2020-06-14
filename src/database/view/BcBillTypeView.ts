import {BcBillType} from "../entity/BcBillType";
import {Column, ViewEntity} from "../decorator";

@ViewEntity({
    expression: `select t.*,t1.name parent_name,t2.value type_value
from bc_bill_type t
left join bc_bill_type t1 on t1.id = t.parent_id
left join bc_dict_data t2 on t2.code = t.type and t2.type_code = 'bill_type'
`,
})
export class BcBillTypeView extends BcBillType {
    @Column()
    parentName: string;

    @Column()
    typeValue: string;
}
