import {BcFund, BdFundPrice} from "../database";
import {Assert} from "../utils/Assert";
import {Inject} from "@nestjs/common";
import {DbService} from "../service/db";
import {Moment} from "moment";
import moment = require("moment");

export class FundService {
    @Inject()
    dbService: DbService;

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

    // 获取价格
    public async getPrice(fundId: string, applyDate: Date): Promise<BdFundPrice> {
        let sql = `
                    select t.*
                    from bd_fund_price t
                    where t.fund_id = @fundId
                      and t.date_time > str_to_date(@applyDate, '%Y-%m-%d %H:%i:%s')
                      and t.price <> -1
                      and not exists(
                            select 1
                            from bd_fund_price it
                            where it.fund_id = t.fund_id
                              and it.date_time < t.date_time
                              and it.date_time > str_to_date(@applyDate, '%Y-%m-%d %H:%i:%s')
                              and t.price <> -1
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
}