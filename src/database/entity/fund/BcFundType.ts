import {Column, Entity} from "../../decorator";
import {BaseEntity} from "../../base";

@Entity()
export class BcFundType extends BaseEntity {
    @Column()
    name: string;
}
