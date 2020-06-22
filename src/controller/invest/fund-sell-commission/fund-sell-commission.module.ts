import {Module} from '@nestjs/common';
import {FundSellCommissionController} from "./fund-sell-commission.controller";
import {FundSellCommissionService} from "./fund-sell-commission.service";

@Module({
  imports: [],
  controllers: [FundSellCommissionController],
  providers:[FundSellCommissionService]
})
export class FundSellCommissionModule {}
