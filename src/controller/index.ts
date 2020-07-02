import {UserModule} from "./user/user.module";
import {DictDataModule} from "./dict-data/dict-data.module";
import {DictTypeModule} from "./dict-type/dict-type.module";
import {BillModule} from "./bill/bill.module";
import {BillTypeModule} from "./bill-type/bill-type.module";
import {BillTemplateModule} from "./bill-template/bill-template.module";
import {CardModule} from "./card/card.module";
import {CardTypeModule} from "./card-type/card-type.module";
import {StatBillMModule} from "./stat-bill-m/stat-bill-m.module";
import {SafeModule} from "./safe/safe.module";
import {HomeModule} from "./app/home/home.module";
import {FundBussTypeModule} from "./invest/fund-buss-type/fund-buss-type.module";
import {FundTypeModule} from "./invest/fund-type/fund-type.module";
import {FundModule} from "./invest/fund/fund.module";
import {FundBuyCommissionModule} from "./invest/fund-buy-commission/fund-buy-commission.module";
import {FundSellCommissionModule} from "./invest/fund-sell-commission/fund-sell-commission.module";
import {FundDealModule} from "./invest/fund-deal/fund-deal.module";
import {FundDealSellModule} from "./invest/fund-deal-sell/fund-deal-sell.module";
import {FundPriceModule} from "./invest/fund-price/fund-price.module";

export const routes:any[] = [
    BillModule,
    BillTemplateModule,
    BillTypeModule,
    CardModule,
    CardTypeModule,
    DictDataModule,
    DictTypeModule,
    StatBillMModule,
    UserModule,

    SafeModule,
    HomeModule,

    FundBussTypeModule,
    FundTypeModule,
    FundModule,
    FundBuyCommissionModule,
    FundSellCommissionModule,

    FundDealModule,
    FundDealSellModule,
    FundPriceModule,
];