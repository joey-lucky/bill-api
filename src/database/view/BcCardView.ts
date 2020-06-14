import {Column, ViewEntity} from "typeorm";
import {BaseView} from "../base";

@ViewEntity({
    name: "bc_card_view",
    expression: `select card.*,
       cardType.name as card_type_name,
       user.name     as user_name
from bc_card card
       left join bc_card_type cardType on cardType.id = card.card_type_id
       left join bc_user user on user.id = card.user_id`,
})
export class BcCardView extends BaseView {
    @Column({name: "name"})
    name: string;

    @Column({name: "balance"})
    balance: number;

    @Column({name: "user_id"})
    userId: string | null;

    @Column({name: "card_type_id",})
    cardTypeId: string | null;

    @Column({name: "user_name",})
    userName: string;

    @Column({name: "card_type_name"})
    cardTypeName: string;
}
