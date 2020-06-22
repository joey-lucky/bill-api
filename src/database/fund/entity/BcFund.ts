import {Column, Entity, JoinColumn} from "../../decorator";
import {BaseEntity} from "../../base";
import {Index, ManyToOne} from "typeorm";
import {BcFundType} from "./BcFundType";
import {BcFundBussType} from "./BcFundBussType";

@Entity()
export class BcFund extends BaseEntity {
    @Column({nullable:false,comment:"基金名称"})
    @Index()
    name: string;

    @Column({nullable:false,comment:"基金代码"})
    @Index({unique:true})
    code: string;

    @Column({nullable:false})
    fundTypeId: string;

    @Column({nullable:false})
    fundBussTypeId: string;

    @ManyToOne(type => BcFundType, {onDelete: "RESTRICT", onUpdate: "NO ACTION"})
    @JoinColumn()
    fundType: BcFundType;

    @ManyToOne(type => BcFundBussType, {onDelete: "RESTRICT", onUpdate: "NO ACTION"})
    @JoinColumn()
    fundBussType: BcFundBussType;
}
