import { PrimaryGeneratedColumn} from "typeorm";
import {Column,Entity} from "../decorator";
import {BaseEntity} from "../base";

@Entity()
export class BcUser extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    loginName: string;

    @Column()
    loginPassword: string;

    @Column()
    pic: string;

    @Column({nullable:true})
    bussWx: string;
}
