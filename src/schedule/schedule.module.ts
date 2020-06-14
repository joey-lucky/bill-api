import {HttpModule, HttpService, Module} from "@nestjs/common";
import {BillDayReportService} from "./providers/bill-day-report.service";
import {CalculateBalanceService} from "./providers/calculate-balance.service";
import {GenerateTokenService} from "./providers/generate-token.service";
import {SendMessageService} from "./providers/send-message.service";
import {Cron, Interval, ScheduleModule as NestScheduleModule} from '@nestjs/schedule';

@Module({
    providers:[
        BillDayReportService,
        CalculateBalanceService,
        GenerateTokenService,
        SendMessageService,
    ],
    imports: [
        NestScheduleModule.forRoot(),
        HttpModule
    ],
})
export class ScheduleModule {
    constructor(
        private readonly billDayReportService: BillDayReportService,
        private readonly calculateBalanceService: CalculateBalanceService,
        private readonly generateTokenService: GenerateTokenService,
        private readonly sendMessageService: SendMessageService,
    ) {
    }

    @Cron("0 0 9 * * *")
    async subscribeBillDayReport() {
        await this.billDayReportService.subscribe();
    }

    @Interval(60 * 1000)
    async subscribeCalculateBalance() {
        await this.calculateBalanceService.subscribe();
    }

    @Interval(60 * 1000)
    async subscribeGenerateToken() {
        await this.generateTokenService.subscribe();
    }

    @Interval(60 * 1000)
    async subscribeSendMessage() {
        await this.sendMessageService.subscribe();
    }
}