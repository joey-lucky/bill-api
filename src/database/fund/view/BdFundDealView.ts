import {Column, ViewEntity} from "../../decorator";
import {BdFundDealBuy} from "../..";

@ViewEntity({
    expression: `
SELECT t.*,
       t1.code                                                             AS fund_code,
       t1.name                                                             AS fund_name,
       t2.name                                                             AS user_name,
       t3.value                                                            AS status_value,
       t4.value                                                            AS data_status_value,
       ifnull(sell.total_sell_count, 0)                                    AS total_sell_count,
       ifnull(sell.total_sell_money, 0)                                    AS total_sell_money,
       ifnull(sell.total_sell_commission, 0)                               AS total_sell_commission,
       round(ifnull(t.buy_count, 0) - ifnull(sell.total_sell_count, 0), 2) as remain_count,
       round(ifnull(sell.total_sell_money, 0) +
             (ifnull(t.buy_count, 0) - ifnull(sell.total_sell_count, 0)) *
             ifnull(t.buy_price, 0), 2)                                    as market_value,
       round(((ifnull(sell.total_sell_money, 0) +
               (ifnull(t.buy_count, 0) - ifnull(sell.total_sell_count, 0)) * ifnull(t.buy_price, 0)) / t.buy_money -
              1), 4)                                                       AS profit_radio,
       round(ifnull(sell.total_sell_money, 0) +
             (ifnull(t.buy_count, 0) - ifnull(sell.total_sell_count, 0)) *
             ifnull(t.buy_price, 0) - t.buy_money, 2)                      AS profit_money
FROM bd_fund_deal_buy t
         LEFT JOIN bc_fund t1 ON t1.id = t.fund_id
         LEFT JOIN bc_user t2 ON t2.id = t.user_id
         LEFT JOIN bc_dict_data t3 ON t3.code = t.status AND t3.type_code = 'fund_deal_status'
         LEFT JOIN bc_dict_data t4 ON t4.code = t.data_status AND t4.type_code = 'fund_data_status'
         LEFT JOIN (
    SELECT it.fund_deal_id,
           sum(it.sell_count)                 AS total_sell_count,
           sum(ifnull(it.sell_money, 0))      AS total_sell_money,
           sum(ifnull(it.sell_commission, 0)) AS total_sell_commission
    FROM bd_fund_deal_sell it
    GROUP BY it.fund_deal_id
) sell ON sell.fund_deal_id = t.id
         LEFT JOIN (
    SELECT max(price) AS price,
           fund_id
    FROM bd_fund_price
    WHERE date_time = (
        SELECT max(date_time) AS date_time
        FROM bd_fund_price
    )
    GROUP BY fund_id
) price ON price.fund_id = t.fund_id
`,
})
export class BdFundDealView extends BdFundDealBuy {
    @Column()
    fundCode: string;

    @Column()
    fundName: string;

    @Column()
    statusValue: string;

    @Column()
    dataStatusValue: string;

    @Column()
    totalSellCount: string;

    @Column()
    totalSellMoney: number;

    @Column()
    totalSellCommission: number;

    @Column()
    remainCount: number;

    @Column()
    marketValue: number;

    @Column()
    profitRadio: number;

    @Column()
    profitMoney: number;
}
