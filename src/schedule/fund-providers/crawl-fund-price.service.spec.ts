import {Test} from '@nestjs/testing';
import {HttpModule} from "@nestjs/common";
import {CrawlFundPriceService} from "./crawl-fund-price.service";
import * as moment from "moment";
import * as cheerio from "cheerio";
import {DbService} from "../../service/db";
import {LoggerService} from "../../service/logger";

describe('crawl-fund-price.service', () => {
    let service: CrawlFundPriceService;

    beforeEach(async () => {
        const moduleFixture = await Test.createTestingModule({
            providers: [
                CrawlFundPriceService,
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
        service = moduleFixture.get<CrawlFundPriceService>(CrawlFundPriceService);
    });

    describe("show", () => {
        it("crawlRemoteHtml not null", async () => {
            const data = await service.crawlRemoteHtml(
                "110022",
                moment("2010-01-01"),
                moment("2010-01-01").add(10,"day"),
            )
           let entity =  await service.htmlToEntity(data);
            console.log(entity);
        });

    });
});
