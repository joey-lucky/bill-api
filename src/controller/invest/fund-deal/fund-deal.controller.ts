import {Controller, Get, Inject, Res} from "@nestjs/common";
import {FundDealService} from "./fund-deal.service";
import {BaseRestController} from "../../base-rest.controller";
import {Response} from "express";

@Controller("/invest/fund-deal")
export class FundDealController  extends BaseRestController{
    @Inject()
    private readonly service: FundDealService;

    @Get("export-excel")
    public async exportExcel(@Res() res: Response) {
        let file = await this.service.getExportExcelFileBuffer();
        res.header("Content-disposition", "attachment;filename=fund.xlsx")
        res.status(200).send(file);
    }

    getService(): any {
        return this.service;
    }
}