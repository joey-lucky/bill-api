import {Module} from '@nestjs/common';
import {BillTemplateController} from "./bill-template.controller";
import {BillTemplateService} from "./bill-template.service";

@Module({
  imports: [],
  controllers: [BillTemplateController],
  providers:[BillTemplateService]
})
export class BillTemplateModule {}
