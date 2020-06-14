import {Controller, Get, Inject, Query} from "@nestjs/common";
import {StatBillMService} from "./stat-bill-m.service";
import {ResponseService} from "../../service/response";

@Controller("stat-bill-m")
export class StatBillMController  {
    @Inject()
    private readonly service: StatBillMService;
    @Inject()
    readonly responseService: ResponseService;

    //获取账单月统计列表
    @Get("get-group-by-month-list")
    public async getGroupByMonthList(@Query() queryParams:any) {
        const data = await this.service.getGroupByMonthList(queryParams);
        return this.responseService.success(data, "");
    }

    @Get("get-sum-data")
    public async getStatData(@Query() queryParams:any) {
        const data = await this.service.getSumData(queryParams);
        return this.responseService.success(data, "");
    }
}