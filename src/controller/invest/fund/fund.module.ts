import {Module} from '@nestjs/common';
import {FundController} from "./fund.controller";
import {FundService} from "./fund.service";

@Module({
  imports: [],
  controllers: [FundController],
  providers:[FundService],
  exports:[FundService]
})
export class FundModule {}
