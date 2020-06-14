import {Controller, Inject} from "@nestjs/common";
import {BillService} from "./bill.service";
import {BaseRestController} from "../base-rest.controller";

@Controller("bill")
export class BillController  extends BaseRestController{
    @Inject()
    private readonly service: BillService;

    getService(): any {
        return this.service;
    }
}