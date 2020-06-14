import {HomeController} from "./home.controller";
import {HomeService} from "./home.service";
import {Module} from '@nestjs/common';

@Module({
  imports: [],
  controllers: [HomeController],
  providers:[HomeService]
})
export class HomeModule {}
