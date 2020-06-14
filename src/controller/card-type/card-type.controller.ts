import {Controller, Inject} from "@nestjs/common";
import {CardTypeService} from "./card-type.service";
import {BaseRestController} from "../base-rest.controller";

@Controller("card-type")
export class CardTypeController  extends BaseRestController{
    @Inject()
    private readonly service: CardTypeService;

    getService(): any {
        return this.service;
    }
}