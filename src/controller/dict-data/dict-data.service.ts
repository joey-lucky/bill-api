import {BcDictData, PageInfo} from "../../database";
import {Assert} from "../../utils/Assert";
import {Injectable, Scope} from "@nestjs/common";
import {BaseService} from "../base.service";
import {RestService} from "../base-rest.controller";

export class DictDataService extends BaseService implements RestService {
    public async create(data: any): Promise<any> {
        const entity: BcDictData = this.parseToEntity(BcDictData, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BcDictData, id);
        //判断是否有子类
        let children = await this.dbService.find(BcDictData, {where: {parentId: id}});
        Assert.isTrue(children.length === 0, "children not null");
        await this.deleteEntity(BcDictData, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcDictData, id);
        const entity: BcDictData = this.parseToEntity(BcDictData, data);
        entity.id = id;
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcDictData, id);
    }

    public async index(params: any): Promise<any[]> {
        let whereCondition = await this.toWhereCondition(params);
        let data = await this.dbService.createQueryBuilder(BcDictData, "t")
            .where(whereCondition.where, whereCondition.params)
            .orderBy("t.order", "ASC")
            .getMany();
        return this.dbService.buildTrees(data);
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        throw new Error("不支持分页")
    }

    private async toWhereCondition(queryParam:any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BcDictData & QueryParams = {...queryParam};
        if (params.id) {
            where += " and t.id = :id ";
        }
        if (params.typeCode) {
            where += " and t.type_code = :typeCode ";
        }
        if (params.keyword) {
            params.keyword = "%" + params.keyword + "%";
            let likeSql = " t.code like :keyword ";
            likeSql += " or t.value like :keyword ";
            where += ` and (${likeSql})`;
        }
        return {where, params};
    }
}

interface QueryParams {
    keyword?: string;
}
