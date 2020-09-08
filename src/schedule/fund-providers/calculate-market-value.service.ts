import {BaseSchedule} from "../schedule.domain";
import {BdFundDeal, BdFundDealSell} from "../../database";
import NP from "number-precision";
import {Inject} from "@nestjs/common";
import {FundService} from "../../controller/invest/fund/fund.service";
import {Cron, Timeout} from "@nestjs/schedule";
import {Assert} from "../../utils/Assert";

/**
 * 计算市值
 */
export class CalculateMarketValueService extends BaseSchedule {
    @Inject()
    fundService: FundService;

    getScheduleName(): string {
        return "计算(基金市值)";
    }

    // @Cron("0 0 4 * * *")
    async schedule() {
        await this.subscribe();
    }

    // @Timeout(1000)
    async schedule2() {
        await this.subscribe();
    }

    async subscribe(): Promise<any> {
        let data = await  this.getPendingCalculateDealList();
        this.log("待处理数量：" + data.length)
        for (let item of data) {
            await this.startCalculateItem(item);
        }
    }

    async startCalculateItem(deal:BdFundDeal){
        this.logItem(deal.id, "开始");
        try {
            let totalSell =await this.getTotalSell(deal);
            let price = await this.fundService.getLatestPrice(deal.fundId);
            Assert.notNull(price,"最新净值为空")
            deal.totalSellCount = totalSell.sellCount;
            deal.totalSellCommission = totalSell.sellCommission;
            deal.totalSellMoney = totalSell.sellMoney;
            deal.remainCount = NP.round(deal.buyCount - deal.totalSellCount, 2);
            deal.marketValue = NP.round(deal.totalSellMoney + deal.remainCount * price.price, 2);
            deal.profitMoney = NP.round(deal.marketValue-deal.buyMoney, 2);
            deal.profitRadio = NP.round(deal.profitMoney/deal.buyMoney, 4);
            if (deal.remainCount === 0) {
                deal.status = "1";
            }
            await deal.save();
            this.logItem(deal.id, "结束");
        } catch (e) {
            this.logItem(deal.id, e.message, e);
        }
    }

    async getPendingCalculateDealList():Promise<BdFundDeal[]> {
        return await BdFundDeal.find({where:{
            status:"0",
            dataStatus:"1",
        }})
    }

    async getTotalSell(deal: BdFundDeal): Promise<BdFundDealSell> {
        let data = await BdFundDealSell.find({
            where: {
                fundDealId: deal.id,
                dataStatus: "1"
            }
        })
        let total: BdFundDealSell = new BdFundDealSell();
        total.sellCount = 0;
        total.sellMoney = 0;
        total.sellCommission = 0;
        for (let item of data) {
            total.sellCount += item.sellCount || 0;
            total.sellMoney += item.sellMoney || 0;
            total.sellCommission += item.sellCommission || 0;
        }
        return total;
    }
}