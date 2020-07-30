import {BcFund, BcFundView, BdFundDealSell, BdFundPrice, PageInfo} from "../../../database";
import {BaseService} from "../../base.service";
import {RestService} from "../../base-rest.controller";
import {Assert} from "../../../utils/Assert";
import NP from "number-precision";
import moment = require("moment");

export class FundService extends BaseService implements RestService {
    public async getBuyCommission(fundId: string, buyMoney: number) {
        let sql = `
                select max(t.commission) as commission
                from bc_fund_buy_commission t
                where t.less_than_money > @buyMoney
                  and t.fund_id = @fundId
        `
        let [model] = await this.dbService.query(sql, {fundId, buyMoney});
        Assert.isTrue(model.commission !== null, "手续费为空");
        return model.commission;
    }

    public async getSellCommission(fundId: string, dayCount: number) {
        let sql = `
                select max(t.commission) as commission
                from bc_fund_sell_commission t
                where t.less_than_day > @dayCount
                  and t.fund_id = @fundId
        `
        let [model] = await this.dbService.query(sql, {fundId, dayCount});
        Assert.isTrue(model.commission !== null, "手续费为空");
        return model.commission;
    }

    public async getPrice(fundId: string, applyDate: Date): Promise<BdFundPrice> {
        let sql = `
        select t.*
        from bd_fund_price t
        where t.fund_id = @fundId
          and t.date_time = (
            select min(it.date_time)
            from bd_fund_price it
            where it.fund_id = @fundId
              and it.date_time > str_to_date(@applyDate, '%Y-%m-%d %H:%i:%s')
              and it.price <> -1
        )
        `
        let params = {
            fundId: fundId,
            applyDate: moment(applyDate).format("YYYY-MM-DD 00:00:00")
        };
        let [model] = await this.dbService.query(sql, params);
        Assert.notNull(model, "净值未更新");
        return this.dbService.toEntity(BdFundPrice, model)
    }

    public async assertSellCountValid(fundDealSell:BdFundDealSell){
        // language=MySQL
        let sql = `
            select t.buy_count - sum(ifnull(t1.sell_count, 0)) as remainCount
            from bd_fund_deal t
                     left join bd_fund_deal_sell t1 on t1.fund_deal_id = t.id
            where t.id = @fundDealId
            group by t.id, t.buy_count
        `
        let params = {fundDealId:fundDealSell.fundDealId}
        let [model] =await this.dbService.query(sql, params);
        Assert.isTrue(fundDealSell.sellCount <= NP.round(model.remainCount, 2),"卖出份额大于剩余份额");
    }

    public async create(data: any): Promise<any> {
        const entity: BcFund = this.parseToEntity(BcFund, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BcFund, id);
        await this.deleteEntity(BcFund, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcFund, id);
        const entity: BcFund = this.parseToEntity(BcFund, data);
        entity.id = id;
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcFund, id);
    }

    public async index(params: any): Promise<any[]> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createQueryBuilder(BcFundView, "t")
            .where(whereCondition.where, whereCondition.params)
            .getMany();
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createPageQueryBuilder(BcFundView, "t")
            .where(whereCondition.where, whereCondition.params)
            .getPageData(pageInfo);
    }

    private async toWhereCondition(queryParam:any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BcFundView & QueryParams = {...queryParam};
        if (params.id) {
            where += " and t.id = :id ";
        }
        if (params.keyword) {
            params.keyword = "%" + params.keyword + "%";
            let likeSql = " t.name like :keyword ";
            likeSql += " or t.code like :keyword ";
            where += ` and (${likeSql})`;
        }
        return {where, params};
    }
}
interface QueryParams {
    keyword?: string;
}
