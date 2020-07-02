import {Test} from '@nestjs/testing';
import {HttpModule} from "@nestjs/common";
import * as moment from "moment";
import {DbService} from "../../service/db";
import {LoggerService} from "../../service/logger";
import {CrawlFundConfigService} from "./crawl-fund-config.service";
import {BcFund} from "../../database";

describe('crawl-fund-price.service', () => {
    let service: CrawlFundConfigService;

    beforeEach(async () => {
        const moduleFixture = await Test.createTestingModule({
            providers: [
                CrawlFundConfigService,
                LoggerService,
                {
                    provide: DbService,
                    useValue: {}
                }
            ],
            imports: [
                HttpModule
            ]
        }).compile();
        service = moduleFixture.get<CrawlFundConfigService>(CrawlFundConfigService);
    });

    describe("show", () => {
        it("crawlRemoteHtml not null", async () => {
            const data = await service.crawlRemoteData()
            let netvaluelist:any;
            eval(data.replace("var ", ""));
            let result:BcFund[] = [];
            if (netvaluelist && netvaluelist.openFundNetValueList) {
                for (let str of netvaluelist.openFundNetValueList) {
                    let obj = JSON.parse(str);
                    let bcFund = new BcFund();
                    bcFund.code = obj.fundCode;
                    bcFund.name = obj.fundSName;
                    result.push(bcFund);
                }
            }
            console.log(result);
        });

    });
});
