import {Controller, Get, Inject, Query} from "@nestjs/common";
import {SafeService} from "./safe.service";
import {ConfigService} from "../../service/config";
import * as jwt from "jsonwebtoken";
import {Assert} from "../../utils/Assert";
import {BaseRestController} from "../base-rest.controller";

@Controller("safe")
export class SafeController extends BaseRestController {
    @Inject()
    private readonly service: SafeService;
    @Inject()
    private readonly configService: ConfigService;

    getService(): any {
        return this.service;
    }

    @Get("login")
    async login(@Query("userName") userName, @Query("password") password) {
        const secret = this.configService.getSecret();
        Assert.hasText(userName, "用户名为空");
        Assert.hasText(password, "密码为空");
        const user = await this.service.login(userName, password);
        const playLoad = {userId: user.id};
        user.token = jwt.sign(playLoad, secret);
        return this.responseService.success([user], "")
    }

    @Get("get-user-info")
    async getUserInfo(@Query("userName") userName, @Query("password") password) {
        let info = await this.service.getUserInfo();
        return this.responseService.success([info], "");
    }
}