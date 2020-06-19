import {Controller, Inject} from "@nestjs/common";
import {FundPriceService} from "./fund-price.service";
import {BaseRestController} from "../../base-rest.controller";

@Controller("/invest/fund-price")
export class FundPriceController  extends BaseRestController{
    @Inject()
    private readonly service: FundPriceService;

    getService(): any {
        return this.service;
    }
}