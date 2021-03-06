import {BdFundDealSell, BdFundDealSellView, PageInfo} from "../../../database";
import {BaseService} from "../../base.service";
import {RestService} from "../../base-rest.controller";
import {Inject} from "@nestjs/common";
import {FundService} from "../fund/fund.service";

export class FundDealDividendService extends BaseService implements RestService {
    @Inject()
    fundService: FundService;

    public async create(data: any): Promise<any> {
        const entity: BdFundDealSell = this.parseToEntity(BdFundDealSell, data);
        await this.fundService.assertSellCountValid(entity);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BdFundDealSell, id);
        await this.deleteEntity(BdFundDealSell, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        throw new Error("不支持编辑功能");
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BdFundDealSell, id);
    }

    public async index(params: any): Promise<any[]> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createQueryBuilder(BdFundDealSellView, "t")
            .where(whereCondition.where, whereCondition.params)
            .orderBy({"t.apply_sell_date": "DESC"})
            .getMany();
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createPageQueryBuilder(BdFundDealSellView, "t")
            .where(whereCondition.where, whereCondition.params)
            .orderBy({"t.apply_sell_date": "DESC"})
            .getPageData(pageInfo);
    }

    private async toWhereCondition(queryParam: any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BdFundDealSellView & QueryParams = {...queryParam};
        if (params.id) {
            where += " and t.id = :id ";
        }
        if (params.fundDealId) {
            where += " and t.fundDealId = :fundDealId ";
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
