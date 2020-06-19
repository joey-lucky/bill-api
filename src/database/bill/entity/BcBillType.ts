import {Column, Entity} from "../../decorator";
import {BaseTreeEntity} from "../../base";

@Entity()
export class BcBillType extends BaseTreeEntity {
    @Column()
    name: string;

    @Column()
    sort: number;

    @Column({comment: "-1支出 1收入 0转账"})
    type: string;
}
