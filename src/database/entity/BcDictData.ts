import {Column, Entity} from "../decorator";
import {Unique} from "typeorm";
import {BaseTreeEntity} from "../base";

@Entity()
@Unique(["typeCode","code"])
export class BcDictData extends BaseTreeEntity {
    @Column()
    code: string;

    @Column()
    value: string;

    @Column()
    order: number;

    @Column()
    typeCode: string;
}
