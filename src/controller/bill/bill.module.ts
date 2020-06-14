import {BillController} from "./bill.controller";
import {BillService} from "./bill.service";
import {Module} from '@nestjs/common';

@Module({
  imports: [],
  controllers: [BillController],
  providers:[BillService]
})
export class BillModule {}
