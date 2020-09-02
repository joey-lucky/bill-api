import {BcUser} from "./bill/entity/BcUser";
import {BcBillType} from "./bill/entity/BcBillType";
import {BdBill} from "./bill/entity/BdBill";
import {BcCard} from "./bill/entity/BcCard";
import {BcCardType} from "./bill/entity/BcCardType";
import {BcDictData} from "./bill/entity/BcDictData";
import {BcDictType} from "./bill/entity/BcDictType";
import {BcToken} from "./bill/entity/BcToken";
import {BcBillTypeView} from "./bill/view/BcBillTypeView";
import {BcCardView} from "./bill/view/BcCardView";
import {BcDictDataView} from "./bill/view/BcDictDataView";
import {BdBillView} from "./bill/view/BdBillView";
import {BcBillTemplateView} from "./bill/view/BcBillTemplateView";
import {BdStatBillMView} from "./bill/view/BdStatBillMView";
import {BcBillTemplate} from "./bill/entity/BcBillTemplate";
import {BdSendMessage} from "./bill/entity/BdSendMessage";
import {BcFund} from "./fund/entity/BcFund";
import {BcFundType} from "./fund/entity/BcFundType";
import {BdFundPrice} from "./fund/entity/BdFundPrice";
import {BcFundBussType} from "./fund/entity/BcFundBussType";
import {BcFundView} from "./fund/view/BcFundView";
import {BcFundBuyCommission} from "./fund/entity/BcFundBuyCommission";
import {BcFundSellCommission} from "./fund/entity/BcFundSellCommission";
import { BdFundDeal } from "./fund/entity/BdFundDeal";
import {BdFundDealSell} from "./fund/entity/BdFundDealSell";
import {BdFundDealView} from "./fund/view/BdFundDealView";
import {BdFundDealSellView} from "./fund/view/BdFundDealSellView";
import {BdFundPriceView} from "./fund/view/BdFundPriceView";
import {BdFundDealDividend} from "./fund/entity/BdFundDealDividend";
import {BdFundDealDividendView} from "./fund/view/BdFundDealDividendView";
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
    BdFundPrice,
    BcFundBussType,
    BcFundBuyCommission,
    BcFundSellCommission,
    BdFundDeal,
    BdFundDealSell,
    BdFundDealDividend,
];

export const views = [
    BcBillTemplateView,
    BcBillTypeView,
    BcCardView,
    BcDictDataView,
    BdBillView,
    BdStatBillMView,
    BcFundView,
    BdFundDealView,
    BdFundDealSellView,
    BdFundPriceView,
    BdFundDealDividendView
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
    BdFundPrice,
    BcFundBussType,
    BcFundView,
    BcFundBuyCommission,
    BcFundSellCommission,
    BdFundDeal,
    BdFundDealSell,
    BdFundDealView,
    BdFundDealSellView,
    BdFundPriceView,
    BdFundDealDividend,
};

export {PageInfo} from "../service/response";