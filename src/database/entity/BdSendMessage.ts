import {DateTimeColumn} from "../decorator";
import {Column,Entity} from "../decorator";
import {BaseEntity} from "../base";

@Entity()
export class BdSendMessage extends BaseEntity {
    @Column()
    userId: string;

    @Column()
    sendStatus: string;

    @Column({ length: 2000})
    msgContent: string;

    @Column({nullable: true})
    errorCode: string;

    @DateTimeColumn()
    sendTime: string|Date;

    @Column()
    tokenId: string;
}