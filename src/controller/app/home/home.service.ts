import {BaseService} from "../../base.service";
import moment = require("moment");

export class HomeService extends BaseService {
    private readonly FORMAT = "YYYY-MM-DD HH:mm:ss";

    public async getCurrTotal(): Promise<any[]> {
        let today = await this.getCurrTotalItemData([
            moment().startOf("day").format(this.FORMAT),
            moment().endOf("day").format(this.FORMAT),
        ]);
        let toWeek = await this.getCurrTotalItemData([
            moment().startOf("isoWeek").format(this.FORMAT),
            moment().endOf("isoWeek").format(this.FORMAT),
        ]);
        let toMonth = await this.getCurrTotalItemData([
            moment().startOf("month").format(this.FORMAT),
            moment().endOf("month").format(this.FORMAT),
        ]);
        let preMonth = await this.getCurrTotalItemData([
            moment().add(-1, "month").startOf("month").format(this.FORMAT),
            moment().add(-1, "month").endOf("month").format(this.FORMAT),
        ]);
        const result = {today, toWeek, toMonth, preMonth};
        return [result];
    }

    private async getCurrTotalItemData(dateRange = []) {
        // language=MySQL
        const sql = "select t2.type,\n" +
            "       round(sum(t.money), 2) as money\n" +
            "from bd_bill t\n" +
            "       left join bc_bill_type t2 on t.bill_type_id = t2.id\n" +
            "where t.date_time >= str_to_date(@startTime,'%Y-%m-%d %H:%i:%s')\n" +
            " and t.date_time <= str_to_date(@endTime,'%Y-%m-%d %H:%i:%s')\n" +
            "group by t2.type\n";
        const params = {
            startTime: dateRange[0],
            endTime: dateRange[1],
        };
        const data = (await this.dbService.query(sql, params)) || [];
        const result: any = {
            startDate: dateRange[0],
            endDate: dateRange[1],
        };
        data.forEach((item) => {
            if (item.type === "1") {
                result.income = item.money;
            } else if (item.type === "-1") {
                result.outgoing = item.money;
            }
        });
        return result;
    }
}