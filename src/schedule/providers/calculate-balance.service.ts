import {BcCard} from "../../database";
import {BaseSchedule} from "../schedule.domain";
import {Interval} from "@nestjs/schedule";

export class CalculateBalanceService extends BaseSchedule {
    getScheduleName(): string {
        return "计算（银行卡余额）";
    }

    @Interval(60 * 1000)
    async subscribe() {
        try {
            this.log("开始");
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
            this.log("结束");
        } catch (e) {
            this.log("失败", e);
        }
    }

}