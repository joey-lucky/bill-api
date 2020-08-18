import {Controller, Inject} from "@nestjs/common";
import {FundDealDividendService} from "./fund-deal-dividend.service";
import {BaseRestController} from "../../base-rest.controller";

@Controller("/invest/fund-deal-dividend")
export class FundDealDividendController  extends BaseRestController{
    @Inject()
    private readonly service: FundDealDividendService;

    getService(): any {
        return this.service;
    }
}