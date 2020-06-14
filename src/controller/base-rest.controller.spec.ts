import {Test} from '@nestjs/testing';
import {PageInfo, ResponseService} from "../service/response";
import {UserController} from "./user/user.controller";
import {UserService} from "./user/user.service";
import {RestService} from "./base-rest.controller";

const pageInfo: PageInfo = {
    pageIndex: 1
};

const model = {
    destroy: {
        id: "destroy",
    },
    index: [{
        id: "index",
    }],
    pageIndex: {
        data: [{
            id: "pageIndex",
        }],
        pageInfo:pageInfo
    },
    show: {
        id: "show",
    },
    update: {
        id: "update",
    },
    create: {
        id: "create",
    },
};

const service: RestService = {
    destroy(id: string): Promise<any> {
        return Promise.resolve(model.destroy);
    },
    index(params: any): Promise<any[]> {
        return Promise.resolve(model.index);
    },
    pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        return Promise.resolve(model.pageIndex);
    },
    show(id: string): Promise<any> {
        return Promise.resolve(model.show);
    },
    update(id: string, data: any): Promise<any> {
        return Promise.resolve(model.update);
    },
    create(data: any): Promise<any> {
        return Promise.resolve(model.create);
    }
};

describe('BaseRestController', () => {
    let controller: UserController;
    let responseService: ResponseService;

    beforeEach(async () => {
        const moduleFixture = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                ResponseService,
                {
                    provide: UserService,
                    useValue: service
                }
            ],
        }).compile();
        controller = moduleFixture.get<UserController>(UserController);
        responseService = moduleFixture.get<ResponseService>(ResponseService);
    });

    describe("create",  () => {
        it("should return response data", async () => {
            let result = await controller.create({});
            let expectResult = responseService.success([model.create]);
            expect(result).toEqual(expectResult);
        });
    });

    describe("destroy",  () => {
        it("should return response data", async () => {
            let result = await controller.destroy("test");
            let expectResult = responseService.success([model.destroy]);
            expect(result).toEqual(expectResult);
        });
        it("should return error 'id is null'", async () => {
            await  expect(controller.destroy(undefined)).rejects.toThrowError("id is null");
        });
    });

    describe("update",  () => {
        it("should return response data", async () => {
            let result = await controller.update("test",{});
            let expectResult = responseService.success([model.update]);
            expect(result).toEqual(expectResult);
        });
        it("should return error 'id is null'", async () => {
            await  expect(controller.update(undefined,{})).rejects.toThrowError("id is null");
        });
    });

    describe("index",  () => {
        it("should return response data", async () => {
            let result = await controller.index({});
            let expectResult = responseService.success(model.index);
            expect(result).toEqual(expectResult);
        });
        it("should return response page data", async () => {
            let result = await controller.index({pageIndex: 1, pageSize: 1});
            let expectResult = responseService.successPage(model.pageIndex.pageInfo, model.pageIndex.data);
            expect(result).toEqual(expectResult);
        });
    });

    describe("show",  () => {
        it("should return error 'id is null'", async () => {
            await  expect(controller.show(undefined)).rejects.toThrowError("id is null");
        });
        it("should return response data", async () => {
            let result = await controller.show("test");
            let expectResult = responseService.success([model.show]);
            expect(result).toEqual(expectResult);
        });
    });
});
