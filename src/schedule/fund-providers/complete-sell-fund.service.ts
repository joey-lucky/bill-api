import {BaseSchedule} from "../schedule.domain";
import {BcFund, BdFundDealBuy, BdFundPrice} from "../../database";
import {Assert} from "../../utils/Assert";
import NP from "number-precision";
import moment = require("moment");
import {Timeout} from "@nestjs/schedule";
import {Inject} from "@nestjs/common";
import {FundService} from "../../fund/fund.service";

export class CompleteBuyFundService extends BaseSchedule {
    private fundMap: Map<string, BcFund> = new Map<string, BcFund>();
    @Inject()
    fundService:FundService;

    getScheduleName(): string {
        return "完善数据(买入记录)";
    }

    // @Cron("0 0 3 * * *")
    // @Timeout(1000)
    async subscribe(): Promise<any> {
        let pendingCompleteList: BdFundDealBuy[] = await this.getPendingFundList();
        this.log("待处理数量："+pendingCompleteList.length)
        for (let bdFundDeal of pendingCompleteList) {
            await this.completeBuyFundDeal(bdFundDeal);
        }
    }

    async completeBuyFundDeal(fundDeal: BdFundDealBuy) {
        let fund = await this.getFund(fundDeal.fundId);
        this.logItem(fund.name, "开始");
        try {
            let fundId = fundDeal.fundId;
            let buyMoney = fundDeal.buyMoney;
            let applyBuyDate = fundDeal.applyBuyDate;
            let combination: number = await this.getBuyCommission(fundId, buyMoney);
            let fundPrice: BdFundPrice = await this.fundService.getPrice(fundId, applyBuyDate);
            // 实际计算买入金额
            let realBuyMoney = NP.round(buyMoney / (1 + combination), 2);
            let buyCount = NP.round(realBuyMoney / fundPrice.price, 2);
            fundDeal.buyCommission = NP.round(buyMoney - realBuyMoney, 2);
            fundDeal.buyPrice = fundPrice.price;
            fundDeal.buyDate = fundPrice.dateTime;
            fundDeal.buyCount = buyCount;
            fundDeal.dataStatus = "1";
            await fundDeal.save();
            this.logItem(fund.name, "结束");
        } catch (e) {
            this.logItem(fund.name, e.message, e);
        }
    }

    private async getFund(fundId): Promise<BcFund> {
        if (!this.fundMap.has(fundId)) {
            let fund = await BcFund.findOne(fundId);
            Assert.notNull(fund, `基金不存在(${fundId})`)
            this.fundMap.set(fundId, fund);
        }
        return this.fundMap.get(fundId);
    }

    private async getBuyCommission(fundId: string, buyMoney: number) {
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

    private async getPendingFundList():Promise<BdFundDealBuy[]>{
        let sql = `
            select *
            from bd_fund_deal_sell t
            where t.data_status = '0'
              and t.apply_buy_date < str_to_date(@datetime, '%Y-%m-%d %H:%i:%s')
            order by t.fund_id
        `
        let params = {
            datetime:moment().format("YYYY-MM-DD 00:00:00")
        };
        let data = await this.dbService.query(sql, params);
        return data.map(item => this.dbService.toEntity(BdFundDealBuy, item));
    }
}