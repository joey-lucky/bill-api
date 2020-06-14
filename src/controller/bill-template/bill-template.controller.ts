import {Controller, Inject} from "@nestjs/common";
import {BillTemplateService} from "./bill-template.service";
import {BaseRestController} from "../base-rest.controller";

@Controller("bill-template")
export class BillTemplateController  extends BaseRestController{
    @Inject()
    private readonly service: BillTemplateService;

    getService(): any {
        return this.service;
    }
}