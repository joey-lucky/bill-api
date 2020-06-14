import {Column, DateTimeColumn, Entity} from "../decorator";
import * as moment from "moment";
import {BaseEntity} from "../base";

@Entity()
export class BcToken extends BaseEntity {
    @Column({length: 36})
    type: string;

    @Column({type: "int"})
    agentId: number;

    @Column({length: 255})
    secret: string;

    @Column({length: 255})
    corpId: string;

    @Column({length: 255})
    accessToken: string;

    @DateTimeColumn()
    expiresIn: string|Date;
}
