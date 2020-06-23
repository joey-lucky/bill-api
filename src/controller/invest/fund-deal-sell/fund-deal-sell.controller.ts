import {Controller, Inject} from "@nestjs/common";
import {FundDealSellService} from "./fund-deal-sell.service";
import {BaseRestController} from "../../base-rest.controller";

@Controller("/invest/fund")
export class FundDealSellController  extends BaseRestController{
    @Inject()
    private readonly service: FundDealSellService;

    getService(): any {
        return this.service;
    }
}