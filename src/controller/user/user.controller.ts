import {Controller, Inject, Scope} from "@nestjs/common";
import {UserService} from "./user.service";
import {BaseRestController} from "../base-rest.controller";

@Controller("user")
export class UserController  extends BaseRestController{
    @Inject()
    private readonly service: UserService;

    getService(): any {
        return this.service;
    }
}