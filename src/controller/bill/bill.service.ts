import {BdBill, BdBillView, PageInfo} from "../../database";
import {BaseService} from "../base.service";
import {RestService} from "../base-rest.controller";
import * as XLSX from "xlsx";

export class BillService extends BaseService implements RestService {
    public async create(data: any): Promise<any> {
        const entity: BdBill = this.parseToEntity(BdBill, data);
        entity.userId = this.getCtxUserId();
        return await this.createEntity(entity);
    }

    public async destroy(id: string): Promise<any> {
        const entity = await this.assertEntityIdExist(BdBill, id);
        await this.deleteEntity(BdBill, id);
        return entity;
    }

    public async update(id: string, data: any): Promise<any> {
        await this.assertEntityIdExist(BdBill, id);
        let entity: BdBill = this.parseToEntity(BdBill, data);
        entity.id = id;
        entity.userId = this.getCtxUserId();
        await this.updateEntity(entity);
        await entity.reload();
        return entity;
    }

    public async show(id: string): Promise<any> {
        return await this.assertEntityIdExist(BdBill, id);
    }

    public async getExportExcelFileBuffer(): Promise<any> {
        let sql = `
            select bill_type_type_value                                   as 类型,
                   bill_type_name                                         as 账单类型,
                   money                                                  as 金额,
                   bill_desc                                              as 名称,
                   date_time                                              as 日期,
                   CONCAT(card_user_name, ' - ', card_name)               as 银行卡,
                   CONCAT(target_card_user_name, ' - ', target_card_name) as 目标卡,
                   user_name                                              as 用户
            from bd_bill_view t
            order by t.date_time desc, t.bill_type_name, t.bill_type_type_value
        `;
        let data = await this.dbService.query(sql);
        let ws = XLSX.utils.json_to_sheet(data, {
            header: [
                "类型",
                "账单类型",
                "金额",
                "名称",
                "日期",
                "银行卡",
                "目标卡",
                "用户"
            ]
        });
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        return XLSX.write(wb, {type: 'buffer', bookType: "xlsx"});
    }

    public async index(params: any): Promise<any[]> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createQueryBuilder(BdBillView, "t")
            .where(whereCondition.where, whereCondition.params)
            .orderBy("t.date_time", "DESC")
            .getMany();
    }

    public async pageIndex(pageInfo: PageInfo, params: any): Promise<{ data: any[]; pageInfo: PageInfo }> {
        let whereCondition = await this.toWhereCondition(params);
        return await this.dbService.createPageQueryBuilder(BdBillView, "t")
            .where(whereCondition.where, whereCondition.params)
            .orderBy("t.date_time", "DESC")
            .getPageData(pageInfo);
    }

    private async toWhereCondition(queryParam: any = {}): Promise<{ where: string, params: any }> {
        let where = " 1=1 ";
        const params: BdBillView & QueryParams = {...queryParam};
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
        if (params.dateTime) {
            where += ` and t.date_time = str_to_date(:dateTime,'%Y-%m-%d %H:%i:%s') `;
        }
        if (params["dateTime>="]) {
            where += ` and t.date_time >= str_to_date(:dateTime1,'%Y-%m-%d %H:%i:%s') `;
            params["dateTime1"] = params["dateTime>="];
            delete params["dateTime>="];
        }
        if (params["dateTime<="]) {
            where += ` and t.date_time <= str_to_date(:dateTime2,'%Y-%m-%d %H:%i:%s') `;
            params["dateTime2"] = params["dateTime<="];
            delete params["dateTime<="];
        }
        if (params.keyword) {
            params.keyword = "%" + params.keyword + "%";
            let likeSql = " t.bill_desc like :keyword ";
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
    dateTimeMoreThanOrEqual: string,
    dateTimeLessThanOrEqual: string,
    dateTime: string | [string, string],
}
