import {HttpModule, HttpService, Module} from "@nestjs/common";
import {ScheduleModule as NestScheduleModule} from '@nestjs/schedule';
import {FundScheduleModule} from "./fund-providers/fund-schedule.module";
import {BillScheduleModule} from "./providers/bill-schedule.module";

@Module({
    imports: [
        NestScheduleModule.forRoot(),
        FundScheduleModule,
        BillScheduleModule,
    ],
})
export class ScheduleModule {
}