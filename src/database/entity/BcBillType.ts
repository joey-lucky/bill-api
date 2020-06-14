import {Column, Entity} from "../decorator";
import {BaseTreeEntity} from "../base";

@Entity()
export class BcBillType extends BaseTreeEntity {
    @Column()
    name: string;

    @Column()
    sort: number;

    @Column({comment: "-1支出 1收入 0转账"})
    type: string;

    get typeName(){
        if (this.type === "-1") {
            return "支出";
        } else if (this.type === "1") {
            return "收入";
        } else {
            return "其它";
        }
    }
}
