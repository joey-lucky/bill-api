import {BcCard, BcCardView, PageInfo} from "../../database";
import {BaseService} from "../base.service";
import {RestService} from "../base-rest.controller";
import {Injectable, Scope} from "@nestjs/common";

export  class CardService extends BaseService implements RestService {
    public async create(data: any): Promise<any> {
        const entity: BcCard = this.parseToEntity(BcCard, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BcCard, id);
        await this.deleteEntity(BcCard, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcCard, id);
        const entity: BcCard = this.parseToEntity(BcCard, data);
        entity.id = id;
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcCard, id);
    }

    public async index(params: any): Promise<any[]> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createQueryBuilder(BcCardView, "t")
            .where(whereCondition.where, whereCondition.params)
            .getMany();
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createPageQueryBuilder(BcCardView, "t")
            .where(whereCondition.where, whereCondition.params)
            .getPageData(pageInfo);
    }

    private async toWhereCondition(queryParam:any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BcCardView & QueryParams = {...queryParam};
        if (params.id) {
            where += " and t.id = :id ";
        }
        if (params.name) {
            where += " and t.name = :name ";
        }
        if (params.balance) {
            where += " and t.balance = :balance ";
        }
        if (params.userId) {
            where += " and t.user_id = :userId ";
        }
        if (params.keyword) {
            params.keyword = "%" + params.keyword + "%";
            let likeSql = " t.name like :keyword ";
            likeSql += " or t.card_type_name like :keyword ";
            likeSql += " or t.user_name like :keyword ";
            likeSql += " or t.balance like :keyword ";
            where += ` and (${likeSql})`;
        }
        return {where, params};
    }
}

interface QueryParams {
    keyword?: string;
}
