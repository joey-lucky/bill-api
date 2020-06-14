import {BeforeInsert} from "typeorm";
import {Assert} from "../../utils/Assert";
import {Column, DateTimeColumn, Entity} from "../decorator";
import {BaseEntity} from "../base";

@Entity()
export class BdBill extends BaseEntity {
    @Column({type: "double"})
    money: number;

    @Column()
    billDesc: string;

    @DateTimeColumn()
    dateTime: string|Date;

    @Column({length: 36})
    billTypeId: string | null;

    @Column({length: 36})
    userId: string | null;

    @Column({length: 36})
    cardId: string | null;

    @Column({length: 36, nullable: true})
    targetCardId: string;

    @BeforeInsert()
    validField() {
        Assert.hasText(this.billDesc, "备注为空");
        Assert.hasText(this.billTypeId, "账单类型为空");
        Assert.hasText(this.userId, "用户为空");
        Assert.isTrue(!!this.dateTime, "时间为空");
        Assert.isTrue(this.money !== 0, "金额为0");
    }
}
