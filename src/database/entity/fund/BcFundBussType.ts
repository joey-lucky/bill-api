import {Column, Entity} from "../../decorator";
import {BaseTreeEntity} from "../../base";
import {ManyToOne} from "typeorm";
import {BcFundType} from "./BcFundType";

@Entity()
export class BcFundBussType extends BaseTreeEntity {
    @Column()
    name: string;

    @Column()
    sort: number;

    @Column()
    fundTypeId: string;

    @ManyToOne(type => BcFundType, {onDelete: "RESTRICT", onUpdate: "NO ACTION"})
    fundType: BcFundType;
}
