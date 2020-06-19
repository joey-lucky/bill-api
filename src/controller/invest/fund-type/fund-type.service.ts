import {BcFundType, PageInfo} from "../../../database";
import {BaseService} from "../../base.service";
import {RestService} from "../../base-rest.controller";

export  class FundTypeService extends BaseService implements RestService {
    public async create(data: any): Promise<any> {
        const entity: BcFundType = this.parseToEntity(BcFundType, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BcFundType, id);
        await this.deleteEntity(BcFundType, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcFundType, id);
        const entity: BcFundType = this.parseToEntity(BcFundType, data);
        entity.id = id;
        entity.updateTime = new Date();
        entity.updateBy = this.getCtxUserId();
        await this.deleteEntity(BcFundType,entity.id);
        await this.create(entity);
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcFundType, id);
    }

    public async index(params: any): Promise<any[]> {
        let whereCondition = await this.toWhereCondition(params);
        let data= await this.dbService.createQueryBuilder(BcFundType, "t")
            .where(whereCondition.where, whereCondition.params)
            .orderBy({type:"ASC"})
            .getMany();
        return this.dbService.buildTrees(data);
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        throw new Error("不支持分页");
    }

    private async toWhereCondition(queryParam:any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BcFundType & QueryParams = {...queryParam};
        if (params.id) {
            where += " and t.id = :id ";
        }
        if (params.name) {
            where += " and t.name = :name ";
        }
        if (params.keyword) {
            params.keyword = "%" + params.keyword + "%";
            let likeSql = " t.name like :keyword ";
            where += ` and (${likeSql})`;
        }
        return {where, params};
    }
}

interface QueryParams {
    keyword?: string;
}