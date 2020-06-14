import {DbService} from "./db.service";
import {PageInfo} from "../response";

describe('DbService', () => {
    let service: DbService;
    let entityManager: any;

    beforeEach(async () => {
        entityManager = {
            query: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn((...args) => ({})),
            findAndCount: jest.fn((...args) => Promise.resolve([[], 100])),
        };
        service = new DbService(entityManager);
    });

    describe("static generatePageInfo", () => {
        it("should return page info", async () => {
            const pageInfo: PageInfo = {
                pageIndex: 1,
                pageSize: 10
            };
            expect(DbService.generatePageInfo(pageInfo, 100)).toEqual({...pageInfo, count: 100, pageCount: 10});
            expect(DbService.generatePageInfo(pageInfo, 101)).toEqual({...pageInfo, count: 101, pageCount: 11});
        });
    });

    describe("static getPageSqlSkip", () => {
        it("should return page info", async () => {
            const pageInfo: PageInfo = {
                pageIndex: 1,
                pageSize: 10
            };
            expect(DbService.getPageSqlSkip({pageIndex: 1, pageSize: 10})).toEqual(0);
            expect(DbService.getPageSqlSkip({pageIndex: 2, pageSize: 10})).toEqual(10);
        });
    });

    describe("getTypeOrmManager", () => {
        it("should return entity manager", async () => {
            expect(service.getTypeOrmManager()).toEqual(entityManager);
        });
    });

    describe("should call entity manager createQueryBuilder method", () => {
        it("should call entity createQueryBuilder", async () => {
            let args: any[] = [1, 2, 3];
            service.createQueryBuilder(args[0], args[1], args[2])
            expect(entityManager.createQueryBuilder.mock.calls.length).toBe(1);
            expect(entityManager.createQueryBuilder.mock.calls[0]).toEqual(args);
        });
    });

    describe("should call entity manager createQueryBuilder method", () => {
        it("should call entity createQueryBuilder", async () => {
            let args: any[] = [1, 2, 3];
            service.createPageQueryBuilder(args[0], args[1], args[2])
            expect(entityManager.createQueryBuilder.mock.calls.length).toBe(1);
            expect(entityManager.createQueryBuilder.mock.calls[0]).toEqual(args);
        });
    });

    describe("query", () => {
        it("should parse sql", async () => {
            let args: any[] = ["select @t1 @t2 @t1", {t1: 1, t2: 2}];
            await service.query(args[0], args[1])
            expect(entityManager.query.mock.calls.length).toBe(1);
            expect(entityManager.query.mock.calls[0]).toEqual(["select ? ? ?", [1, 2, 1]]);
        });
    });

    describe("find", () => {
        it("should call entity manager find method", async () => {
            let args: any[] = [1, 2];
            await service.find(args[0], args[1])
            expect(entityManager.find.mock.calls.length).toBe(1);
            expect(entityManager.find.mock.calls[0]).toEqual(args);
        });
    });

    describe("buildTrees", () => {
        it("should return tree data", async () => {
            let data = [
                {id: 1},
                {id: 2, parentId: 1},
                {id: 3, parentId: 2},
            ];
            let result = await service.buildTrees(data)
            let expectResult = [{
                ...data[0],
                children: [{
                    ...data[1],
                    children: [{
                        ...data[2],
                        children: []
                    }]
                }]
            }];
            expect(result).toEqual(expectResult);
        });
    });

    describe("findPage", () => {
        it("should return page data", async () => {
            const pageInfo: PageInfo = {
                pageIndex: 1,
                pageSize: 10
            };
            let args: any[] = [1, pageInfo, {}];
            let skip = DbService.getPageSqlSkip(pageInfo);
            let exceptPageInfo = DbService.generatePageInfo(pageInfo, 100);
            let expectQuery = {take: pageInfo.pageSize, skip: skip};
            const result = await service.findPage(args[0], args[1], args[2]);
            expect(entityManager.findAndCount.mock.calls.length).toBe(1);
            expect(entityManager.findAndCount.mock.calls[0]).toEqual([args[0], expectQuery]);
            expect(result.data).toEqual([]);
            expect(result.pageInfo).toEqual(exceptPageInfo);
        });
    });

    describe("findOne", () => {
        it("should call entity manager findOne method", async () => {
            let args: any[] = [1, 2];
            const result = await service.findOne(args[0], args[1]);
            expect(entityManager.findOne.mock.calls.length).toBe(1);
            expect(entityManager.findOne.mock.calls[0]).toEqual(args);
        });
    });

    describe("findAndCount", () => {
        it("should call entity manager findAndCount method", async () => {
            let args: any[] = [1, 2];
            const result = await service.findAndCount(args[0], args[1]);
            expect(entityManager.findAndCount.mock.calls.length).toBe(1);
            expect(entityManager.findAndCount.mock.calls[0]).toEqual(args);
        });
    });

    describe("create", () => {
        it("should call entity manager create method", async () => {
            let args: any[] = [1, 2];
            const result = await service.create(args[0], args[1]);
            expect(entityManager.create.mock.calls.length).toBe(1);
            expect(entityManager.create.mock.calls[0]).toEqual(args);
        });
    });

    describe("save", () => {
        it("should call entity manager save method", async () => {
            let args: any[] = [1, 2,3];
            // @ts-ignore
            const result = await service.save(...args);
            expect(entityManager.save.mock.calls.length).toBe(1);
            expect(entityManager.save.mock.calls[0]).toEqual(args);
        });
    });

    describe("delete", () => {
        it("should call entity manager delete method", async () => {
            let args: any[] = [1, 2];
            // @ts-ignore
            const result = await service.delete(...args);
            expect(entityManager.delete.mock.calls.length).toBe(1);
            expect(entityManager.delete.mock.calls[0]).toEqual(args);
        });
    });
});
