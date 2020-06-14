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
];