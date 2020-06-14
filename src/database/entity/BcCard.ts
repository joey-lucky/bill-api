import {Column,Entity} from "../decorator";
import {BaseEntity} from "../base";

@Entity()
export class BcCard extends BaseEntity {
    @Column()
    name: string;

    @Column({ type: "double"})
    balance: number;

    @Column({length: 36})
    userId: string | null;

    @Column({length: 36})
    cardTypeId: string | null;
}
