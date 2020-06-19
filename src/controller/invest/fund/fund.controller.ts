import {Controller, Inject} from "@nestjs/common";
import {FundService} from "./fund.service";
import {BaseRestController} from "../../base-rest.controller";

@Controller("/invest/fund")
export class FundController  extends BaseRestController{
    @Inject()
    private readonly service: FundService;

    getService(): any {
        return this.service;
    }
}