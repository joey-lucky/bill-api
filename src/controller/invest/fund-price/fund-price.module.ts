import {Module} from '@nestjs/common';
import {FundPriceController} from "./fund-price.controller";
import {FundPriceService} from "./fund-price.service";

@Module({
  imports: [],
  controllers: [FundPriceController],
  providers:[FundPriceService]
})
export class FundPriceModule {}
