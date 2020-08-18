import {Module} from '@nestjs/common';
import {FundDealDividendController} from "./fund-deal-dividend.controller";
import {FundDealDividendService} from "./fund-deal-dividend.service";
import {FundModule} from "../fund/fund.module";
import {FundService} from "../fund/fund.service";

@Module({
  imports: [FundService],
  controllers: [FundDealDividendController],
  providers:[FundDealDividendService,FundService]
})
export class FundDealDividendModule {}
