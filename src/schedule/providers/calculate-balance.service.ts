import {BcCard} from "../../database";
import {Inject, Injectable} from "@nestjs/common";
import {DbService} from "../../service/db";
import {LoggerService} from "../../service/logger";
import {Schedule} from "../schedule.domain";

@Injectable()
export class CalculateBalanceService implements Schedule {
    static get schedule() {
        return {
            interval: "60s", // 60 分钟间隔
            type: "worker", // 指定所有的 worker 都需要执行
            immediate: false,
            disable: false,
        };
    }

    @Inject()
    private readonly dbService:DbService;
    @Inject()
    private readonly loggerService: LoggerService;

    subscribe = async () => {
        try {
            const data: any[] = await this.dbService.query(`
              select t.card_id as cardId,
                     round(sum(t.money),2) as money
              from (select bb.card_id, sum(bb.money) as money from bd_bill bb group by bb.card_id
                    union all
                    select bb.target_card_id as card_id, sum(0 - bb.money) as money
                    from bd_bill bb
                    where bb.target_card_id is not null
                    group by bb.target_card_id)t
              group by t.card_id`);
            const cardList = await this.dbService.find(BcCard);
            const balanceMap = data.reduce((pre, curr) => {
                pre[curr.cardId] = curr.money;
                return pre;
            }, {});
            for (const bcCard of cardList) {
                bcCard.balance = balanceMap[bcCard.id] || 0;
                bcCard.updateTime = new Date();
                await bcCard.save();
            }
            this.loggerService.scheduleLogger.verbose( "CalculateBalance success");
        } catch (e) {
            this.loggerService.scheduleLogger.error("CalculateBalance error " + e.message);
            throw e;
        }
    }
}