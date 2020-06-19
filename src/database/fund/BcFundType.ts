import {Column, Entity} from "../decorator";
import {BaseTreeEntity} from "../base";

@Entity()
export class BcFundType extends BaseTreeEntity {
    @Column()
    name: string;

    @Column()
    sort: number;
}
