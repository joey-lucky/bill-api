import {ViewEntity} from "typeorm";
import {BaseView} from "../base";
import {Column} from "../decorator";

@ViewEntity({
    name: "bd_bill_view",
    expression: `select bill.*,
       user.name           as user_name,
       billType.name       as bill_type_name,
       billType.type       as bill_type_type,
       dictData.value      as bill_type_type_value,
       card.name           as card_name,
       card.user_id        as card_user_id,
       cardUser.name       as card_user_name,
       targetCard.name     as target_card_name,
       targetCard.user_id  as target_card_user_id,
       targetCardUser.name as target_card_user_name
from bd_bill bill
         left join bc_bill_type billType on billType.id = bill.bill_type_id
         left join bc_user user on user.id = bill.user_id
         left join bc_card card on card.id = bill.card_id
         left join bc_user cardUser on cardUser.id = card.user_id
         left join bc_card targetCard on targetCard.id = bill.target_card_id
         left join bc_user targetCardUser on targetCardUser.id = targetCard.user_id
         left join bc_dict_data dictData on dictData.code = billType.type and dictData.type_code = 'bill_type'`,
})
export class BdBillView extends BaseView {
    @Column()
    money: number;

    @Column()
    billDesc: string;

    @Column()
    dateTime: Date;

    @Column()
    billTypeId: string | null;

    @Column()
    userId: string | null;

    @Column()
    cardId: string | null;

    @Column()
    targetCardId: string;

    @Column()
    userName: string;

    @Column()
    billTypeName: string;

    @Column()
    cardName: string;

    @Column()
    cardUserId: string;

    @Column()
    cardUserName: string;

    @Column()
    targetCardName: string;

    @Column()
    targetCardUserId: string;

    @Column()
    targetCardUserName: string;

    @Column()
    billTypeType: string;

    @Column()
    billTypeTypeValue: string;
}
