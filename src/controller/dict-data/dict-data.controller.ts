import {Controller, Inject} from "@nestjs/common";
import {DictDataService} from "./dict-data.service";
import {BaseRestController} from "../base-rest.controller";

@Controller("dict-data")
export class DictDataController  extends BaseRestController{
    @Inject()
    private readonly service: DictDataService;

    getService(): any {
        return this.service;
    }
}