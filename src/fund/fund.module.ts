import {Module} from "@nestjs/common";
import {FundService} from "./fund.service";

@Module({
    providers:[FundService],
    exports:[FundService]
})
export class FundModule {

}