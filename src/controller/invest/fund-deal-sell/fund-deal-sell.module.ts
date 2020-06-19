import {Module} from '@nestjs/common';
import {FundDealSellController} from "./fund-deal-sell.controller";
import {FundDealSellService} from "./fund-deal-sell.service";
import {FundModule} from "../fund/fund.module";
import {FundService} from "../fund/fund.service";

@Module({
  imports: [FundService],
  controllers: [FundDealSellController],
  providers:[FundDealSellService,FundService]
})
export class FundDealSellModule {}
