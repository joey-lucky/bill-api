import {Controller, Inject} from "@nestjs/common";
import {DictTypeService} from "./dict-type.service";
import {BaseRestController} from "../base-rest.controller";

@Controller("dict-type")
export class DictTypeController  extends BaseRestController{
    @Inject()
    private readonly service: DictTypeService;

    getService(): any {
        return this.service;
    }
}