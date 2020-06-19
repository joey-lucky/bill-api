import {Controller, Inject} from "@nestjs/common";
import {FundTypeService} from "./fund-type.service";
import {BaseRestController} from "../../base-rest.controller";

@Controller("bill-type")
export class FundTypeController  extends BaseRestController{
    @Inject()
    private readonly service: FundTypeService;

    getService(): any {
        return this.service;
    }
}