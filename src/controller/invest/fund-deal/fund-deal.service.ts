import {BdFundDeal, BdFundDealView, PageInfo} from "../../../database";
import {BaseService} from "../../base.service";
import {RestService} from "../../base-rest.controller";
import * as XLSX from "xlsx";

export class FundDealService extends BaseService implements RestService {
    public async create(data: any): Promise<any> {
        const entity: BdFundDeal = this.parseToEntity(BdFundDeal, data);
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BdFundDeal, id);
        await this.deleteEntity(BdFundDeal, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BdFundDeal, id);
        const entity: BdFundDeal = this.parseToEntity(BdFundDeal, data);
        entity.id = id;
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BdFundDeal, id);
    }

    public async index(params: any): Promise<any[]> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createQueryBuilder(BdFundDealView, "t")
            .where(whereCondition.where, whereCondition.params)
            .orderBy({"t.apply_buy_date": "DESC"})
            .getMany();
    }

    public async getExportExcelFileBuffer(): Promise<any> {
        let sql = `
            select fund_code             as 基金代码,
                   fund_name             as 基金名称,
                   buy_money             as 买入金额,
                   apply_buy_date        as 申请买入日期,
                   buy_date              as 买入日期,
                   buy_money             as 买入金额,
                   buy_count             as 买入份额,
                   buy_price             as 买入单价,
                   buy_commission        as 买入手续费,
                   data_status_value     as 数据状态,
                   status_value          as 状态,
                   total_sell_count      as 卖出份额,
                   total_sell_money      as 卖出金额,
                   total_sell_commission as 卖出手续费,
                   remain_count          as 剩余份额,
                   market_value          as 市值,
                   profit_radio          as 盈利比例,
                   profit_money          as 盈利金额
            from bd_fund_deal_view
        `;
        let data = await this.dbService.query(sql);
        let ws = XLSX.utils.json_to_sheet(data, {
            header: [
                "基金代码",
                "基金名称",
                "买入金额",
                "申请买入日期",
                "买入日期",
                "买入金额",
                "买入份额",
                "买入单价",
                "买入手续费",
                "数据状态",
                "状态",
                "卖出份额",
                "卖出金额",
                "卖出手续费",
                "剩余份额",
                "市值",
                "盈利比例",
                "盈利金额",
            ]
        });
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        return XLSX.write(wb, {type: 'buffer', bookType: "xlsx"});
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createPageQueryBuilder(BdFundDealView, "t")
            .where(whereCondition.where, whereCondition.params)
            .orderBy({"t.apply_buy_date": "DESC"})
            .getPageData(pageInfo);
    }

    private async toWhereCondition(queryParam: any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BdFundDealView & QueryParams = {...queryParam};
        if (params.id) {
            where += " and t.id = :id ";
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
