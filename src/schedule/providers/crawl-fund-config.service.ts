import {Schedule} from "../schedule.domain";
import * as moment from "moment";
import {Moment} from "moment";
import {HttpService, Inject} from "@nestjs/common";
import {toGetUrl} from "../../utils/url.utils";
import {Cron, Interval, Timeout} from "@nestjs/schedule";
import {BcFund, BdFundPrice} from "../../database";
import * as cheerio from "cheerio";
import {DbService} from "../../service/db";
import {LoggerService} from "../../service/logger";

export class CrawlFundConfigService implements Schedule {
    @Inject()
    private readonly httpService: HttpService
    @Inject()
    private readonly dbService: DbService;
    @Inject()
    private readonly loggerService: LoggerService;

    @Timeout(1000)
    async subscribe(): Promise<any> {
        this.loggerService.scheduleLogger.verbose(`爬取基金列表\t开始`);
        let str = await this.crawlRemoteData();
        let entities = await this.dataToEntity(str);
        this.loggerService.scheduleLogger.verbose(`爬取基金列表\t数量：${entities.length}`);
        let needSaveEntities =await this.getNeedInsertEntities(entities);
        this.loggerService.scheduleLogger.verbose(`爬取基金列表\t新增数量：${needSaveEntities.length}`);
        for (let item of needSaveEntities) {
            await item.save();
        }
        this.loggerService.scheduleLogger.verbose(`爬取基金列表\t结束`);
    }

    // 将html解析成entity
    async dataToEntity(str: string): Promise<BcFund[]> {
        let netvaluelist: any = {};
        eval(str.replace("var ", ""));
        let result: BcFund[] = [];
        if (netvaluelist && netvaluelist.openFundNetValueList) {
            for (let str of netvaluelist.openFundNetValueList) {
                try {
                    let obj = JSON.parse(str);
                    let bcFund = new BcFund();
                    bcFund.code = obj.fundCode;
                    bcFund.name = obj.fundSName;
                    result.push(bcFund);
                } catch (e) {

                }
            }
        }
        return result;
    }

    // http://fund.jrj.com.cn/json/netvaluelist/open?openFundType=1&manaCode=0&pageSize=99999&currentPage=1&sortType=6&order=1&obj=netvaluelist
    async crawlRemoteData(): Promise<string> {
        const completeUrl = "http://fund.jrj.com.cn/json/netvaluelist/open?openFundType=1&manaCode=0&pageSize=999999&currentPage=1&sortType=6&order=1&obj=netvaluelist";
        const config = {headers: {'Content-Type': 'text/html; charset=utf-8'}};
        this.loggerService.scheduleLogger.verbose("CrawlFundPriceService " + completeUrl);
        const {data} = await this.httpService.get(completeUrl, config).toPromise();
        return data;
    }

    private async getNeedInsertEntities(entities: BcFund[]):Promise<BcFund[]> {
        const fundList = await BcFund.find();
        let codeSet = new Set(fundList.map(item => item.code));
        return entities.filter(item => !codeSet.has(item.code));
    }
}