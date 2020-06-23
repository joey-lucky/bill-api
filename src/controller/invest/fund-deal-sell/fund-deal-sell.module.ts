import {Module} from '@nestjs/common';
import {FundDealSellController} from "./fund-deal-sell.controller";
import {FundDealSellService} from "./fund-deal-sell.service";

@Module({
  imports: [],
  controllers: [FundDealSellController],
  providers:[FundDealSellService]
})
export class FundDealSellModule {}
