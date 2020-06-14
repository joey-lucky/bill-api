import {Test} from '@nestjs/testing';
import {PageInfo, ResponseService} from "../service/response";
import {UserController} from "./user/user.controller";
import {UserService} from "./user/user.service";
import {RestService} from "./base-rest.controller";
import {DbService, PageQuerySelectQueryBuilder} from "../service/db";
import {
    BaseEntity,
    DeepPartial,
    DeleteResult, EntityManager,
    EntitySchema, FindManyOptions,
    ObjectType,
    QueryRunner, SaveOptions,
    SelectQueryBuilder
} from "typeorm";

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

// @ts-ignore
const mockDbService: DbService = {
    buildTrees(data?: any[], treeId?: string): any[] {
        return [];
    },
    create<Entity>(entityClass: ObjectType<Entity>, plainObject?: DeepPartial<Entity>): Entity {
        return undefined;
    },
    createPageQueryBuilder<Entity>(entityClass: ObjectType<Entity>, alias: string, queryRunner?: QueryRunner): PageQuerySelectQueryBuilder<Entity> {
        return undefined;
    },
    createQueryBuilder<Entity>(entityClass: ObjectType<Entity>, alias: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity> {
        return undefined;
    },
    delete<Entity>(targetOrEntity: ObjectType<Entity> | EntitySchema<Entity> | string, criteria: any): Promise<DeleteResult> {
        return Promise.resolve(undefined);
    },
    async find<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>): Promise<Entity[]> {
        return Promise.resolve([]);
    },
    async findAndCount<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>): Promise<[Entity[], number]> {
        return Promise.resolve([[], 0]);
    },
    async findOne<T extends BaseEntity>(entityClass: ObjectType<T>, id: string): Promise<T> {
        return Promise.resolve(undefined);
    },
    async findPage<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, pageInfo: PageInfo, options?: FindManyOptions<Entity>): Promise<{ data: Entity[]; pageInfo: PageInfo }> {
        return Promise.resolve({data: [], pageInfo: undefined});
    },
    getTypeOrmManager(): EntityManager {
        return undefined;
    },
    async query(sql: string, params?: any): Promise<any[]> {
        return Promise.resolve([]);
    },

    // @ts-ignore
    save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: ObjectType<Entity> | EntitySchema<Entity>, entity: T, options?: SaveOptions): Promise<T> {
        return Promise.resolve(undefined);
    }
};

describe('BaseService', () => {
    let controller: UserController;
    let service: UserService;
    let responseService: ResponseService;

    beforeEach(async () => {
        const moduleFixture = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                ResponseService,
                UserService,
                {
                    provide: DbService,
                    useValue: mockDbService
                }
            ],
        }).compile();
        controller = moduleFixture.get<UserController>(UserController);
        responseService = moduleFixture.get<ResponseService>(ResponseService);
        service = moduleFixture.get<UserService>(UserService);
    });

    describe("create",  () => {
        it("should return response data", async () => {
            let result = await service.create({});
            expect(result).toEqual(model.create);
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
