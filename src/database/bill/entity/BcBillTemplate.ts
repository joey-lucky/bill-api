import {Column,Entity} from "../../decorator";
import {BaseEntity} from "../../base";

@Entity()
export class BcBillTemplate extends BaseEntity {
    @Column({length: 255})
    name: string;

    @Column()
    billDesc: string;

    @Column({length: 36})
    billTypeId: string | null;

    @Column({length: 36})
    userId: string | null;

    @Column({length: 36})
    cardId: string | null;

    @Column({length: 36, nullable: true})
    targetCardId: string | null;
}