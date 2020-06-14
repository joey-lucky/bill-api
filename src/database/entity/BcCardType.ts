import {Column,Entity} from "../decorator";
import {BaseEntity} from "../base";

@Entity()
export class BcCardType extends BaseEntity {
    @Column()
    name: string;
}
