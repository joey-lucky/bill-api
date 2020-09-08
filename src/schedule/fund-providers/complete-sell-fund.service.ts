import {BaseSchedule} from "../schedule.domain";
import {BcFund, BdFundDeal, BdFundDealSell, BdFundPrice} from "../../database";
import {Assert} from "../../utils/Assert";
import NP from "number-precision";
import {Inject} from "@nestjs/common";
import moment = require("moment");
import {Timeout} from "@nestjs/schedule";
import {FundService} from "../../controller/invest/fund/fund.service";

/**
 * 自动完善卖出记录
 * 完善卖出价格，手续费等。
 */
export class CompleteSellFundService extends BaseSchedule {
    @Inject()
    fundService: FundService;

    getScheduleName(): string {
        return "完善数据(卖出记录)";
    }

    // @Cron("0 0 3 * * *")
    // @Timeout(1000)
    async subscribe(): Promise<any> {
        let pendingCompleteList: BdFundDealSell[] = await this.getPendingFundList();
        this.log("待处理数量：" + pendingCompleteList.length)
        for (let bdFundDeal of pendingCompleteList) {
            try{
                await this.completeSellFundDeal(bdFundDeal);
            }catch (e) {
                this.logItem(bdFundDeal.id,"执行错误",e)
            }
        }
    }

    private async completeSellFundDeal(fundDealSell: BdFundDealSell) {
        let fundDeal = await this.dbService.findOne(BdFundDeal, fundDealSell.fundDealId);
        let fund = await this.dbService.findOne(BcFund, fundDeal.fundId);
        this.logItem(fund.name, "开始");
        try {
            let fundId = fund.id;
            let applySellDate = fundDealSell.applySellDate;
            let sellCount = fundDealSell.sellCount;
            let fundPrice= await this.fundService.getPrice(fundId, applySellDate);
            let sellDate = fundPrice.dateTime;
            let holdDayCount = moment(sellDate).diff(moment(fundDeal.buyDate), "day");//持有时长
            let commission: number = await this.fundService.getSellCommission(fundId, holdDayCount);
            let totalMoney = NP.round(sellCount * fundPrice.price, 2);
            fundDealSell.sellCommission = NP.round(totalMoney * commission, 2);
            fundDealSell.sellMoney = NP.round(totalMoney - fundDealSell.sellCommission , 2);
            fundDealSell.sellDate = fundPrice.dateTime;
            fundDealSell.sellPrice = fundPrice.price;
            fundDealSell.dataStatus = "1";
            await fundDealSell.save();
            this.logItem(fund.name, "结束");
        } catch (e) {
            this.logItem(fund.name, e.message, e);
        }
    }

    private async getPendingFundList(): Promise<BdFundDealSell[]> {
        // language=MySQL
        let sql = `
            select *
            from bd_fund_deal_sell t
            where t.data_status = '0'
        `
        let params = {
            datetime: moment().format("YYYY-MM-DD 00:00:00")
        };
        let data = await this.dbService.query(sql, params);
        return data.map(item => this.dbService.toEntity(BdFundDealSell, item));
    }
}