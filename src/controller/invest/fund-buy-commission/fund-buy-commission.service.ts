import {BcFundBuyCommission, PageInfo} from "../../../database";
import {BaseService} from "../../base.service";
import {RestService} from "../../base-rest.controller";

export class FundBuyCommissionService extends BaseService implements RestService {
    public async create(data: any): Promise<any> {
        const entity: BcFundBuyCommission = this.parseToEntity(BcFundBuyCommission, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BcFundBuyCommission, id);
        await this.deleteEntity(BcFundBuyCommission, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcFundBuyCommission, id);
        const entity: BcFundBuyCommission = this.parseToEntity(BcFundBuyCommission, data);
        entity.id = id;
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcFundBuyCommission, id);
    }

    public async index(params: any): Promise<any[]> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createQueryBuilder(BcFundBuyCommission, "t")
            .where(whereCondition.where, whereCondition.params)
            .orderBy({"t.less_than_money":"ASC"})
            .getMany();
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createPageQueryBuilder(BcFundBuyCommission, "t")
            .where(whereCondition.where, whereCondition.params)
            .orderBy({"t.less_than_money":"ASC"})
            .getPageData(pageInfo);
    }

    private async toWhereCondition(queryParam:any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BcFundBuyCommission & QueryParams = {...queryParam};
        if (params.id) {
            where += " and t.id = :id ";
        }
        if (params.fundId) {
            where += " and t.fund_id = :fundId ";
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
