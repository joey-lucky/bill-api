import * as moment from "moment";
import {BcUser, BdSendMessage} from "../../database";
import {BaseSchedule} from "../schedule.domain";
import {Cron} from "@nestjs/schedule";

export class BillDayReportService extends BaseSchedule {
    getScheduleName(): string {
        return "生成(账单日报)";
    }

    @Cron("0 0 9 * * *")
    async subscribe() {
        try {
            this.log("开始");
            const start = moment().add(-1, "day").format("YYYY-MM-DD");
            const end = moment().format("YYYY-MM-DD");
            const data: any[] = await this.dbService.query(`
                select t1.name,
                       round(sum(t.money), 2) as money
                from bd_bill t
                       left join bc_bill_type t1 on t1.id = t.bill_type_id
                where t1.type <> '0'
                  and t.date_time >= str_to_date('${start}', '%Y-%m-%d')
                  and t.date_time < str_to_date('${end}', '%Y-%m-%d')
                group by t1.name, t1.type
                order by t1.type`,
            );
            let msgContent = "【账单日报】";
            for (const item of data) {
                const {name, money} = item;
                msgContent += "\n" + name + ":" + money;
            }
            const userList = await this.dbService.find(BcUser);
            for (const user of userList) {
                const entity = new BdSendMessage();
                entity.sendStatus = "0";
                entity.tokenId = "c341a369-7847-4159-b106-e778006311e1";
                entity.userId = user.id;
                entity.msgContent = msgContent;
                await entity.save();
            }
            this.log("结束");
        } catch (e) {
            this.log("失败", e);
        }
    }
}