import {BillDayReportService} from "./bill-day-report.service";
import {CalculateBalanceService} from "./calculate-balance.service";
import {GenerateTokenService} from "./generate-token.service";
import {SendMessageService} from "./send-message.service";
import {HttpModule, Module} from "@nestjs/common";

@Module({
    providers:[
        BillDayReportService,
        CalculateBalanceService,
        GenerateTokenService,
        SendMessageService,
    ],
    imports: [
        HttpModule
    ],
})
export class BillScheduleModule {
}