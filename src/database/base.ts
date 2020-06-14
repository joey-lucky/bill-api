import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    BaseEntity as OrmBaseEntity,
} from "typeorm";
import {Assert} from "../utils/Assert";
import {Column} from "./decorator";

export class BaseEntity extends OrmBaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({name: "create_time", nullable: true, type: "datetime"})
    createTime: Date;

    @UpdateDateColumn({name: "update_time", nullable: true, type: "datetime"})
    updateTime: Date;

    @Column({name: "create_by", length: 36})
    createBy: string;

    @Column({name: "update_by", length: 36})
    updateBy: string | null;

    @BeforeInsert()
    completeCreateInfo() {
        if (!this.createTime) {
            this.createTime = new Date();
        }
        if (!this.createBy) {
            this.createBy = "admin";
        }
    }

    @BeforeUpdate()
    completeUpdateInfo() {
        if (!this.updateTime) {
            this.updateTime = new Date();
        }
        if (!this.updateBy) {
            this.updateBy = "admin";
        }
    }

    @AfterLoad()
    deleteUselessColumn() {
        delete this.createBy;
        delete this.updateBy;
        delete this.createTime;
        delete this.updateTime;
    }
}

export class BaseView extends OrmBaseEntity {
    @PrimaryColumn({name: "id"})
    id: string;
}

export class BaseTreeEntity extends BaseEntity {
    @Column()
    parentId: string;

    @BeforeInsert()
    @BeforeUpdate()
    verifyParentId() {
        if (this.id && this.parentId) {
            Assert.isTrue(this.id !== this.parentId, "id不能等于parentId");
        }
    }
}
