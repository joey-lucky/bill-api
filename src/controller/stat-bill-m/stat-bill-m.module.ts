import {Module} from '@nestjs/common';
import {StatBillMController} from "./stat-bill-m.controller";
import {StatBillMService} from "./stat-bill-m.service";

@Module({
  imports: [],
  controllers: [StatBillMController],
  providers:[StatBillMService]
})
export class StatBillMModule {}
