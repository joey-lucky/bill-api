import {BaseSchedule} from "../schedule.domain";
import {BcFund, BdFundDeal, BdFundPrice} from "../../database";
import NP from "number-precision";
import {Timeout} from "@nestjs/schedule";
import {Inject} from "@nestjs/common";
import {FundService} from "../../controller/invest/fund/fund.service";

export class CompleteBuyFundService extends BaseSchedule {
    @Inject()
    fundService: FundService;

    getScheduleName(): string {
        return "完善数据(买入记录)";
    }

    // @Cron("0 0 3 * * *")
    // @Timeout(1000)
    async subscribe(): Promise<any> {
        let pendingCompleteList = await this.dbService.find(BdFundDeal, {where: {dataStatus: "0"}});
        this.log("待处理数量：" + pendingCompleteList.length)
        for (let bdFundDeal of pendingCompleteList) {
            try{
                await this.completeBuyFundDeal(bdFundDeal);
            }catch (e) {
                this.logItem(bdFundDeal.id,"执行错误", e);
            }
        }
    }

    async completeBuyFundDeal(fundDeal: BdFundDeal) {
        let fund = await this.dbService.findOne(BcFund, fundDeal.fundId);
        this.logItem(fund.name, "开始");
        try {
            let fundId = fundDeal.fundId;
            let buyMoney = fundDeal.buyMoney;
            let applyBuyDate = fundDeal.applyBuyDate;
            let combination: number = await this.fundService.getBuyCommission(fundId, buyMoney);
            let fundPrice: BdFundPrice = await this.fundService.getPrice(fundId, applyBuyDate);
            let realBuyMoney = NP.round(buyMoney / (1 + combination), 2);
            let buyCount = NP.round(realBuyMoney / fundPrice.price, 2);
            fundDeal.buyCommission = NP.round(buyMoney - realBuyMoney, 2);
            fundDeal.buyPrice = fundPrice.price;
            fundDeal.buyDate = fundPrice.dateTime;
            fundDeal.buyCount = buyCount;
            fundDeal.remainCount = buyCount;
            fundDeal.dataStatus = "1";
            await fundDeal.save();
            this.logItem(fund.name, "结束");
        } catch (e) {
            this.logItem(fund.name, e.message, e);
        }
    }
}