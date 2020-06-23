import {Controller, Inject} from "@nestjs/common";
import {FundDealService} from "./fund-deal.service";
import {BaseRestController} from "../../base-rest.controller";

@Controller("/invest/fund-deal")
export class FundDealController  extends BaseRestController{
    @Inject()
    private readonly service: FundDealService;

    getService(): any {
        return this.service;
    }
}