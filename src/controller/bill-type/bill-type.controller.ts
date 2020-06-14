import {Controller, Inject} from "@nestjs/common";
import {BillTypeService} from "./bill-type.service";
import {BaseRestController} from "../base-rest.controller";

@Controller("bill-type")
export class BillTypeController  extends BaseRestController{
    @Inject()
    private readonly service: BillTypeService;

    getService(): any {
        return this.service;
    }
}