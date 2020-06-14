import {Injectable, Scope} from "@nestjs/common";
import {BcUser} from "../../database";
import {PageInfo} from "../../service/response";
import {BaseService} from "../base.service";
import {RestService} from "../base-rest.controller";

export class UserService extends BaseService implements RestService {
    public async create(data: any): Promise<any> {
        const entity: BcUser = this.parseToEntity(BcUser, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BcUser, id);
        await this.deleteEntity(BcUser, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcUser, id);
        const entity: BcUser = this.parseToEntity(BcUser, data);
        entity.id = id;
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcUser, id);
    }

    public async index(params: any): Promise<any[]> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createQueryBuilder(BcUser, "t")
            .where(whereCondition.where, whereCondition.params)
            .getMany();
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createPageQueryBuilder(BcUser, "t")
            .where(whereCondition.where, whereCondition.params)
            .getPageData(pageInfo);
    }

    private async toWhereCondition(queryParam: any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BcUser & QueryParams = {...queryParam};
        if (params.id) {
            where += " and t.id = :id ";
        }
        if (params.name) {
            where += " and t.name = :name ";
        }
        if (params.loginName) {
            where += " and t.loginName = :loginName ";
        }
        if (params.keyword) {
            params.keyword = "%" + params.keyword + "%";
            let likeSql = " t.name like :keyword ";
            likeSql += " or t.loginName like :keyword ";
            where += ` and (${likeSql})`;
        }
        return {where, params};
    }
}

interface QueryParams {
    keyword?: string;
}
