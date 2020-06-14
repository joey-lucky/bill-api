import {Controller, Delete, Get, Inject, Param} from "@nestjs/common";
import {HomeService} from "./home.service";
import {Assert} from "../../../utils/Assert";
import {ResponseService} from "../../../service/response";

@Controller("/app/home")
export class HomeController {
    @Inject()
    private readonly service: HomeService;
    @Inject()
    readonly responseService: ResponseService;

    //增
    @Get("/get-curr-total")
    public async destroy() {
        const data = await this.service.getCurrTotal();
        return this.responseService.success(data, "");
    }
}