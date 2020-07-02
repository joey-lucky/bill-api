import {Schedule} from "../schedule.domain";
import {HttpService, Inject} from "@nestjs/common";
import {Timeout} from "@nestjs/schedule";
import {BcFund, BdFundDeal, BdFundPrice} from "../../database";
import {DbService} from "../../service/db";
import {LoggerService} from "../../service/logger";
import {Assert} from "../../utils/Assert";
import moment = require("moment");

export class CompleteBuyFundService implements Schedule {
    @Inject()
    private readonly httpService: HttpService
    @Inject()
    private readonly dbService: DbService;
    @Inject()
    private readonly loggerService: LoggerService;

    private fundMap: Map<string, BcFund> = new Map<string, BcFund>();

    // @Cron("0 0 3 * * *")
    @Timeout(1000)
    async subscribe(): Promise<any> {
        let pendingCompleteList: BdFundDeal[] = await BdFundDeal.find({where: {dataStatus: "0"}});

        for (let bdFundDeal of pendingCompleteList) {
            try {
                let fundId = bdFundDeal.fundId;
                let buyMoney = bdFundDeal.buyMoney;
                let applyBuyDate = bdFundDeal.applyBuyDate;
                let combination: number = await this.getBuyCommission(fundId, buyMoney);
                let fundPrice: BdFundPrice = await this.getBuyPriceInfo(fundId, applyBuyDate);
                bdFundDeal.buyCommission = combination;
                bdFundDeal.buyPrice = fundPrice.price;
                bdFundDeal.buyDate = fundPrice.dateTime;
                bdFundDeal.buyCount = (buyMoney - combination) / fundPrice.price;
                bdFundDeal.remainCount = bdFundDeal.buyCount;
                bdFundDeal.dataStatus = "1";
            } catch (e) {

            }
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
        let fund = await this.getFund(fundId);
        let combination = null;
        Assert.isTrue(combination !== null, `${fund.name}\t手续费为空}`);
        return combination;
    }

    private async getBuyPriceInfo(fundId: string, applyBuyDate: Date) {
        let fund = await this.getFund(fundId);
        let fundPrice: BdFundPrice = null;

        Assert.notNull(fundPrice, `${fund.name}\t${moment(applyBuyDate).format("YYYY-MM-DD")}净值不能存在}`)
        return undefined;
    }
}