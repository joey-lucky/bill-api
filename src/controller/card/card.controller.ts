import {Controller, Inject} from "@nestjs/common";
import {CardService} from "./card.service";
import {BaseRestController} from "../base-rest.controller";

@Controller("card")
export class CardController  extends BaseRestController{
    @Inject()
    private readonly service: CardService;

    getService(): any {
        return this.service;
    }
}