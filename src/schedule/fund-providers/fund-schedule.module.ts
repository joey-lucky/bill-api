import {HttpModule, Module} from "@nestjs/common";
import {FundModule} from "../../controller/invest/fund/fund.module";
import {CompleteBuyFundService} from "./complete-buy-fund.service";
import {CompleteSellFundService} from "./complete-sell-fund.service";
import {CrawlFundConfigService} from "./crawl-fund-config.service";
import {CrawlFundPriceService} from "./crawl-fund-price.service";
import {CalculateMarketValueService} from "./calculate-market-value.service";


@Module({
    providers:[
        CompleteBuyFundService,
        CompleteSellFundService,
        CrawlFundConfigService,
        CrawlFundPriceService,
        CalculateMarketValueService,
    ],
    imports: [
        HttpModule,
        FundModule,
    ],
})
export class FundScheduleModule {
}