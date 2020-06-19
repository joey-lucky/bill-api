import {BdFundPrice, BdFundPriceView, PageInfo} from "../../../database";
import {BaseService} from "../../base.service";
import {RestService} from "../../base-rest.controller";

export class FundPriceService extends BaseService implements RestService {
    public async create(data: any): Promise<any> {
        const entity: BdFundPrice = this.parseToEntity(BdFundPrice, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BdFundPrice, id);
        await this.deleteEntity(BdFundPrice, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BdFundPrice, id);
        const entity: BdFundPrice = this.parseToEntity(BdFundPrice, data);
        entity.id = id;
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BdFundPrice, id);
    }

    public async index(params: any): Promise<any[]> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createQueryBuilder(BdFundPriceView, "t")
            .where(whereCondition.where, whereCondition.params)
            .orderBy("t.date_time","DESC")
            .getMany();
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createPageQueryBuilder(BdFundPriceView, "t")
            .where(whereCondition.where, whereCondition.params)
            .orderBy("t.date_time","DESC")
            .getPageData(pageInfo);
    }

    private async toWhereCondition(queryParam:any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BdFundPriceView & QueryParams = {...queryParam};
        if (params.id) {
            where += " and t.id = :id ";
        }
        if (params.fundId) {
            where += " and t.fund_id = :fundId ";
        }
        if (params.fundCode) {
            where += " and t.fund_code = :fundCode ";
        }
        if (params.keyword) {
            params.keyword = "%" + params.keyword + "%";
            let likeSql = " t.fund_name like :keyword ";
            likeSql+=" or t.fund_code like :keyword "
            where += ` and (${likeSql})`;
        }
        return {where, params};
    }
}
interface QueryParams {
    keyword?: string;
}
