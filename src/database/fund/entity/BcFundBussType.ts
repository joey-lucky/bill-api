import {Column, Entity} from "../../decorator";
import {BaseTreeEntity} from "../../base";

@Entity()
export class BcFundBussType extends BaseTreeEntity {
    @Column()
    name: string;

    @Column()
    sort: number;
}
