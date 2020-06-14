import {Module} from '@nestjs/common';
import {CardTypeController} from "./card-type.controller";
import {CardTypeService} from "./card-type.service";

@Module({
  imports: [],
  controllers: [CardTypeController],
  providers:[CardTypeService]
})
export class CardTypeModule {}
