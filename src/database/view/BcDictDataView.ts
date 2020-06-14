import {BcBillType} from "../index";
import {Column, ViewEntity} from "../decorator";
import {BcDictData} from "../entity/BcDictData";

@ViewEntity({
    expression: `select t.*,
       t1.value as type_code_value
from bc_dict_data t
         left join bc_dict_type t1 on t1.code = t.type_code`,
})
export class BcDictDataView extends BcDictData {
    @Column()
    parentValue: string;

    @Column()
    typeCodeValue: string;
}
