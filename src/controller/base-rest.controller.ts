import {Body, Delete, Get, Inject, Param, Post, Put, Query} from "@nestjs/common";
import {PageInfo, ResponseService} from "../service/response";
import {Assert} from "../utils/Assert";

export abstract class BaseRestController {
    @Inject()
    readonly responseService: ResponseService;

    abstract getService(): any;

    //增
    @Post()
    public async create(@Body() body) {
        const model = await this.getService().create(body);
        return this.responseService.success([model], "");
    }

    //增
    @Delete(":id")
    public async destroy(@Param("id") id) {
        Assert.hasText(id, "id is null");
        const model = await this.getService().destroy(id);
        return this.responseService.success([model], "");
    }

    //改
    @Put(":id")
    public async update(@Param("id") id, @Body() body) {
        Assert.hasText(id, "id is null");
        const model = await this.getService().update(id, body);
        return this.responseService.success([model], "");
    }

    //查单个
    @Get(":id")
    public async show(@Param("id") id) {
        Assert.hasText(id, "id is null");
        const model = await this.getService().show(id);
        return this.responseService.success([model], "");
    }

    //查多个
    @Get()
    public async index(@Query() query) {
        const params = query || {};
        const {pageIndex, pageSize, ...rest} = params;
        if (pageIndex && pageSize) {
            let pageInfo: PageInfo = {pageIndex, pageSize};
            const result = await this.getService().pageIndex(pageInfo, rest);
            return this.responseService.successPage(result.pageInfo, result.data, "");
        } else {
            const data = await this.getService().index(params);
            return this.responseService.success(data, "");
        }
    }
}

export interface RestService {
    create?(data: any): Promise<any>;

    destroy?(id: string): Promise<any>;

    update?(id: string, data: any): Promise<any>;

    show(id: string): Promise<any>;

    index(params: any): Promise<any[]>;

    pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }>;
}