import {Module} from '@nestjs/common';
import {FundTypeController} from "./fund-type.controller";
import {FundTypeService} from "./fund-type.service";

@Module({
  imports: [],
  controllers: [FundTypeController],
  providers:[FundTypeService]
})
export class FundTypeModule {}
