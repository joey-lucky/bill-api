import {Module} from '@nestjs/common';
import {FundBuyCommissionController} from "./fund-buy-commission.controller";
import {FundBuyCommissionService} from "./fund-buy-commission.service";

@Module({
  imports: [],
  controllers: [FundBuyCommissionController],
  providers:[FundBuyCommissionService]
})
export class FundBuyCommissionModule {}
