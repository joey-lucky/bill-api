import {BcBillTemplate, BcBillTemplateView, PageInfo} from "../../database";
import {BaseService} from "../base.service";
import {RestService} from "../base-rest.controller";

export  class BillTemplateService extends BaseService implements RestService {
    public async create(data: any): Promise<any> {
        const entity:BcBillTemplate = this.parseToEntity(BcBillTemplate, data);
        entity.userId = this.getCtxUserId();
        await this.createEntity(entity);
        await entity.reload();
        return entity;
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BcBillTemplate, id);
        await this.deleteEntity(BcBillTemplate, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BcBillTemplate, id);
        let entity:BcBillTemplate = this.parseToEntity(BcBillTemplate, data);
        entity.id = id;
        entity.userId = this.getCtxUserId();
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BcBillTemplate, id);
    }

    public async index(params: any): Promise<any[]> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createQueryBuilder(BcBillTemplateView, "t")
            .where(whereCondition.where, whereCondition.params)
            .getMany();
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createPageQueryBuilder(BcBillTemplateView, "t")
            .where(whereCondition.where, whereCondition.params)
            .getPageData(pageInfo);
    }

    private async toWhereCondition(queryParam:any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BcBillTemplateView & QueryParams = {...queryParam};
        if (params.id) {
            where += " and t.id = :id ";
        }
        if (params.userId) {
            where += " and t.user_id = :userId ";
        }
        if (params.billTypeId) {
            where += " and t.bill_type_id = :billTypeId ";
        }
        if (params.targetCardId) {
            where += " and t.target_card_id = :targetCardId ";
        }
        if (params.cardId) {
            where += " and t.card_id = :cardId ";
        }
        if (params.billDesc) {
            where += " and t.bill_desc = :billDesc ";
        }
        if (params.billTypeType) {
            where += " and t.bill_type_type = :billTypeType ";
        }
        if (params.cardIdOrTargetCardId) {
            where += " and (t.card_id = :cardIdOrTargetCardId or t.target_card_id = :cardIdOrTargetCardId)";
        }
        if (params.keyword) {
            params.keyword = "%" + params.keyword + "%";
            let likeSql = " t.bill_desc like :keyword ";
            likeSql += " or t.name like :keyword ";
            likeSql += " or t.user_name like :keyword ";
            likeSql += " or t.bill_type_name like :keyword ";
            where += ` and (${likeSql})`;
        }
        return {where, params};
    }
}

interface QueryParams {
    keyword?: string;
    cardIdOrTargetCardId: string;
    dateTime: string | [string, string],
}
