import {BcBillTemplate} from "../entity/BcBillTemplate";
import {Column, ViewEntity} from "../decorator";

@ViewEntity({
    expression: `select billTemplate.*,
       user.name           as user_name,
       billType.name       as bill_type_name,
       billType.type       as bill_type_type,
       billTypeDict.value  as bill_type_value,
       card.name           as card_name,
       card.user_id        as card_user_id,
       cardUser.name       as card_user_name,
       targetCard.name     as target_card_name,
       targetCard.user_id  as target_card_user_id,
       targetCardUser.name as target_card_user_name
from bc_bill_template billTemplate
         left join bc_bill_type billType on billType.id = billTemplate.bill_type_id
         left join bc_dict_data billTypeDict
                   on billTypeDict.code = billType.type and billTypeDict.type_code = 'bill_type'
         left join bc_user user on user.id = billTemplate.user_id
         left join bc_card card on card.id = billTemplate.card_id
         left join bc_user cardUser on cardUser.id = card.user_id
         left join bc_card targetCard on targetCard.id = billTemplate.target_card_id
         left join bc_user targetCardUser on targetCardUser.id = targetCard.user_id  `,
})
export class BcBillTemplateView extends BcBillTemplate {
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
    billTypeValue: string;
}
