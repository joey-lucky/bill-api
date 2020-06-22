import {Controller, Inject} from "@nestjs/common";
import {FundBuyCommissionService} from "./fund-buy-commission.service";
import {BaseRestController} from "../../base-rest.controller";

@Controller("/invest/fund-buy-commission")
export class FundBuyCommissionController  extends BaseRestController{
    @Inject()
    private readonly service: FundBuyCommissionService;

    getService(): any {
        return this.service;
    }
}