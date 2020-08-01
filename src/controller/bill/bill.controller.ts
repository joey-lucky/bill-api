import {Controller, Get, Inject, Res} from "@nestjs/common";
import {BillService} from "./bill.service";
import {BaseRestController} from "../base-rest.controller";
import {Response} from "express";
import * as XLSX from "xlsx";

@Controller("bill")
export class BillController extends BaseRestController {
    @Inject()
    private readonly service: BillService;

    //增
    @Get("export-excel")
    public async exportExcel(@Res() res: Response) {
        let file = await this.service.getExportExcelFileBuffer();
        res.header("Content-disposition", "attachment;filename=bill.xlsx")
        res.status(200).send(file);
    }

    getService(): any {
        return this.service;
    }
}