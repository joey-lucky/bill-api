import {Module} from '@nestjs/common';
import {FundDealController} from "./fund-deal.controller";
import {FundDealService} from "./fund-deal.service";

@Module({
  imports: [],
  controllers: [FundDealController],
  providers:[FundDealService]
})
export class FundDealModule {}
