import {BcUser} from "./entity/BcUser";
import {BcBillType} from "./entity/BcBillType";
import {BdBill} from "./entity/BdBill";
import {BcCard} from "./entity/BcCard";
import {BcCardType} from "./entity/BcCardType";
import {BcDictData} from "./entity/BcDictData";
import {BcDictType} from "./entity/BcDictType";
import {BcToken} from "./entity/BcToken";
import {BcBillTypeView} from "./view/BcBillTypeView";
import {BcCardView} from "./view/BcCardView";
import {BcDictDataView} from "./view/BcDictDataView";
import {BdBillView} from "./view/BdBillView";
import {BcBillTemplateView} from "./view/BcBillTemplateView";
import {BdStatBillMView} from "./view/BdStatBillMView";
import {BcBillTemplate} from "./entity/BcBillTemplate";
import {BdSendMessage} from "./entity/BdSendMessage";
import {BcFund} from "./entity/fund/BcFund";
import {BcFundType} from "./entity/fund/BcFundType";
import {BdFundIopv} from "./entity/fund/BdFundIopv";
import {BcFundBussType} from "./entity/fund/BcFundBussType";
export * from "./base";

export const tables = [
    BcUser,
    BcBillTemplate,
    BcBillType,
    BcCard,
    BcCardType,
    BcDictData,
    BcDictType,
    BcToken,
    BdBill,
    BdSendMessage,
    BcFund,
    BcFundType,
    BdFundIopv,
    BcFundBussType,
];

export const views = [
    BcBillTemplateView,
    BcBillTypeView,
    BcCardView,
    BcDictDataView,
    BdBillView,
    BdStatBillMView,
];

export {
    BcUser,
    BcBillTemplate,
    BcBillType,
    BcCard,
    BcCardType,
    BcDictData,
    BcDictType,
    BcToken,
    BdBill,
    BdSendMessage,
    BcBillTemplateView,
    BcBillTypeView,
    BcCardView,
    BcDictDataView,
    BdBillView,
    BdStatBillMView,
    BcFund,
    BcFundType,
    BdFundIopv,
    BcFundBussType,
};

export {PageInfo} from "../service/response";