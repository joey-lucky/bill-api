import {Column, ViewEntity} from "typeorm";
import {BaseView} from "../base";

@ViewEntity({
    name: "bd_stat_bill_m_view",
    expression: `select uuid() as id,
       t.bill_type_id,
       t.card_id,
       t.user_id,
       card.name                                                            as card_name,
       user.name                                                            as user_name,
       billType.name                                                        as bill_type_name,
       t.money,
       billType.type  as billTypeType,
       str_to_date(concat(t.date_time, '-01 00:00:00'), '%Y-%m-%d %H:%i:%s')as date_time
from (select ROUND(sum(t.money), 2)            as money,
       DATE_FORMAT(t.date_time, '%Y-%m') as date_time,
       t.bill_type_id,
       t.card_id,
       t.user_id
from bd_bill t
         left join bc_bill_type t1 on t1.id = t.bill_type_id
group by DATE_FORMAT(t.date_time, '%Y-%m'), t.user_id, t.bill_type_id, t.card_id) t
       left join bc_card card on card.id = t.card_id
       left join bc_user user on user.id = t.user_id
       left join bc_bill_type billType on billType.id = t.bill_type_id`,
})
export class BdStatBillMView extends BaseView{
    @Column()
    money: number;

    @Column({name: "date_time"})
    dateTime: Date;

    @Column({name: "user_id"})
    userId: string;

    @Column({name: "card_id"})
    cardId: string;

    @Column({name: "bill_type_id"})
    billTypeId: string;

    @Column({name: "bill_type_name"})
    billTypeName: string;

    @Column({name: "user_name"})
    userName: string;

    @Column({name: "card_name"})
    cardName: string;
}
