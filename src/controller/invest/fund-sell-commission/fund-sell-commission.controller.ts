import {Controller, Inject} from "@nestjs/common";
import {FundSellCommissionService} from "./fund-sell-commission.service";
import {BaseRestController} from "../../base-rest.controller";

@Controller("/invest/fund-sell-commission")
export class FundSellCommissionController  extends BaseRestController{
    @Inject()
    private readonly service: FundSellCommissionService;

    getService(): any {
        return this.service;
    }
}