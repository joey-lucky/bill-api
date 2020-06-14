import {Module} from '@nestjs/common';
import {BillTypeController} from "./bill-type.controller";
import {BillTypeService} from "./bill-type.service";

@Module({
  imports: [],
  controllers: [BillTypeController],
  providers:[BillTypeService]
})
export class BillTypeModule {}
