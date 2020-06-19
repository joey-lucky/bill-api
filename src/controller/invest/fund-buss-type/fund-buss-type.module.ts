import {Module} from '@nestjs/common';
import {FundBussTypeController} from "./fund-buss-type.controller";
import {FundBussTypeService} from "./fund-buss-type.service";

@Module({
  imports: [],
  controllers: [FundBussTypeController],
  providers:[FundBussTypeService]
})
export class FundBussTypeModule {}
