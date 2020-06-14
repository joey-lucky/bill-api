import {Inject, Injectable, Scope} from "@nestjs/common";
import {DbService} from "../service/db";
import {BaseEntity} from "../database";
import {DeepPartial, ObjectType} from "typeorm";
import {Assert} from "../utils/Assert";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";

@Injectable({scope:Scope.REQUEST})
export class BaseService {
    @Inject()
    dbService: DbService;
    @Inject(REQUEST)
    request:Request;

    protected async assertEntityIdExist<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, id: string): Promise<Entity> {
        let entity: Entity = await this.dbService.findOne(entityClass, id);
        Assert.isTrue(!!entity, `id=${id} not exist`);
        return entity;
    }

    protected getCtxUserId() {
        // ts-ignore
        return this.request.user.id;
    }

    protected parseToEntity<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, plainObject?: DeepPartial<Entity>): Entity {
        return this.dbService.create(entityClass, plainObject);
    }

    protected parseToEntities<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, plainObject?: Array<DeepPartial<Entity>>): Entity[] {
        const entities = [];
        for (const obj of plainObject) {
            entities.push(this.dbService.create(entityClass, obj));
        }
        return entities;
    }

    protected async createEntity<Entity extends BaseEntity>(entity: Entity):Promise<Entity> {
        entity.createBy = this.getCtxUserId();
        entity.updateBy = this.getCtxUserId();
        entity.createTime = new Date();
        entity.updateTime = new Date();
        await this.dbService.save(entity.constructor, entity);
        delete entity.createBy;
        delete entity.updateBy;
        delete entity.createTime;
        delete entity.updateTime
        return entity;
    }

    protected async updateEntity<Entity extends BaseEntity>(entity: Entity) {
        entity.updateBy = this.getCtxUserId();
        entity.updateTime = new Date();
        await this.dbService.save(entity.constructor, entity);
    }

    protected async deleteEntity<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, id: string) {
        await this.dbService.delete(entityClass, id);
    }
}