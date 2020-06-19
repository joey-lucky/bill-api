import {Column, Entity} from "../../decorator";
import {BaseEntity} from "../../base";

@Entity()
export class BcFund extends BaseEntity {
    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    fundTypeId: string;
}
