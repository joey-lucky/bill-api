import {Controller, Inject} from "@nestjs/common";
import {FundBussTypeService} from "./fund-buss-type.service";
import {BaseRestController} from "../../base-rest.controller";

@Controller("/invest/fund-buss-type")
export class FundBussTypeController  extends BaseRestController{
    @Inject()
    private readonly service: FundBussTypeService;

    getService(): any {
        return this.service;
    }
}