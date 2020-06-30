import {HttpModule, HttpService, Module} from "@nestjs/common";
import {BillDayReportService} from "./providers/bill-day-report.service";
import {CalculateBalanceService} from "./providers/calculate-balance.service";
import {GenerateTokenService} from "./providers/generate-token.service";
import {SendMessageService} from "./providers/send-message.service";
import {Cron, Interval, ScheduleModule as NestScheduleModule} from '@nestjs/schedule';
import {ConfigService} from "../service/config";
import {CrawlFundPriceService} from "./providers/crawl-fund-price.service";

@Module({
    providers:[
        BillDayReportService,
        CalculateBalanceService,
        GenerateTokenService,
        SendMessageService,
        CrawlFundPriceService,
    ],
    imports: [
        NestScheduleModule.forRoot(),
        HttpModule
    ],
})
export class ScheduleModule {
    constructor(
        private readonly configService: ConfigService,
        private readonly billDayReportService: BillDayReportService,
        private readonly calculateBalanceService: CalculateBalanceService,
        private readonly generateTokenService: GenerateTokenService,
        private readonly sendMessageService: SendMessageService,
        private readonly crawlFundPriceService: CrawlFundPriceService,
    ) {
    }

    @Cron("0 0 9 * * *")
    async subscribeBillDayReport() {
         this.configService.getSchedule() && await this.billDayReportService.subscribe();
    }

    @Interval(60 * 1000)
    async subscribeCalculateBalance() {
        this.configService.getSchedule() &&  await this.calculateBalanceService.subscribe();
    }

    @Interval(60 * 1000)
    async subscribeGenerateToken() {
        this.configService.getSchedule() && await this.generateTokenService.subscribe();
    }

    @Interval(60 * 1000)
    async subscribeSendMessage() {
        this.configService.getSchedule() &&  await this.sendMessageService.subscribe();
    }
}