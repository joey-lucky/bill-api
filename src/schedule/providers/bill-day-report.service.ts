import * as moment from "moment";
import {BcUser, BdSendMessage} from "../../database";
import {Inject, Injectable} from "@nestjs/common";
import {DbService} from "../../service/db";
import {LoggerService} from "../../service/logger";
import {Schedule} from "../schedule.domain";

@Injectable()
export class BillDayReportService implements Schedule {
    @Inject()
    private readonly dbService: DbService;
    @Inject()
    private readonly loggerService: LoggerService;

    static get schedule() {
        return {
            // 每三小时准点执行一次
            cron: "0 0 9 * * *",
            // interval: "60000s", // 60 分钟间隔
            type: "worker", // 指定所有的 worker 都需要执行
            immediate: false,
        };
    }

    subscribe = async () => {
        try {
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
            this.loggerService.scheduleLogger.verbose("[schedule]", "BillDayReportSchedule success");
        } catch (e) {
            this.loggerService.scheduleLogger.error("[schedule]", "BillDayReportSchedule error " + e.message);
            throw e;
        }
    }
}