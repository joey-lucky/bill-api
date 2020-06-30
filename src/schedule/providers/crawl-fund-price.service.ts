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

export class CrawlFundPriceService implements Schedule {
    static DEF_START_TIME:Moment = moment("2010-01-01");

    @Inject()
    private readonly httpService: HttpService
    @Inject()
    private readonly dbService: DbService;
    @Inject()
    private readonly loggerService: LoggerService;

    @Cron("0 0 3 * * *")
    async subscribe(): Promise<any> {
        const fundList = await BcFund.find();
        for (let fund of fundList) {
            this.loggerService.scheduleLogger.verbose(`${fund.name}-爬取净值数据\t开始`);
            let latestDate:Date =await this.getLatestDate(fund);
            let startTime = CrawlFundPriceService.DEF_START_TIME;
            if (latestDate !== null) {
                startTime = moment(latestDate).add(1,"day");
            }
            this.loggerService.scheduleLogger.verbose(`${fund.name}-爬取净值数据\t开始时间：${startTime.format("YYYY-MM-DD")}`);
            let crawlData = await this.crawlFundPriceData(fund,startTime)
            this.loggerService.scheduleLogger.verbose(`${fund.name}-爬取净值数据\t开始存储,数据长度：${crawlData.length}`);
            for (let item of crawlData) {
                item.fundId = fund.id;
                try{
                    await item.save();
                }catch (e) {
                }
            }
            this.loggerService.scheduleLogger.verbose(`${fund.name}-爬取净值数据\t结束`);
        }
    }

    async getLatestDate(fund: BcFund):Promise<Date>{
        // language=MySQL
        let sql = `
            select max(t.date_time) as dateTime
            from bd_fund_price t
            where t.fund_id = @fundId
        `;
        let data = await this.dbService.query(sql, {fundId: fund.id})
        let model = data[0];
        return model.dateTime;
    }

    async crawlFundPriceData(fund:BcFund,startTime:Moment):Promise<BdFundPrice[]>{
        let endTime: Moment = moment().add(-1, "day").startOf("day");
        let curr = startTime;
        const result: BdFundPrice[] = [];
        while (curr.isBefore(endTime)) {
            let start = curr.clone().add(1, "day");
            let end = curr.clone().add(10, "day");
            if (end.isAfter(endTime)) {
                end = endTime;
            }
            let html = await this.crawlRemoteHtml(fund.code, start, end);
            let entities  = await this.htmlToEntity(html);
            result.push(...entities);
            curr = end;
        }
        return result;
    }

    // 将html解析成entity
    async htmlToEntity(html: string): Promise<BdFundPrice[]> {
        const result: BdFundPrice[] = []
        cheerio.load(html)("tbody tr").each(function (i, elem) {
            try{
                const datetime = elem.children[0].children[0].data;
                const price = elem.children[1].children[0].data;
                const percent = elem.children[3].children[0].data;
                const bdFundPrice = new BdFundPrice();
                bdFundPrice.dateTime = moment(datetime,"YYYY-MM-DD").toDate();
                bdFundPrice.price = Number.parseFloat(price);
                bdFundPrice.increase = Number.parseFloat(percent.replace("%", ""));
                result.push(bdFundPrice);
            }catch (e) {
            }
        })
        return result;
    }

    // http://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&code=110022&sdate=2020-01-01&edate=2020-06-01
    async crawlRemoteHtml(code: string, startDate: Moment, endDate: Moment): Promise<string> {
        const dayCount = startDate.diff(endDate, "day") + 1;
        const url = "http://fund.eastmoney.com/f10/F10DataApi.aspx";
        const config = {headers: {'Content-Type': 'text/html; charset=utf-8'}};
        const params = {
            'type': 'lsjz',
            'code': code,
            'page': 1,
            'per': dayCount,
            'sdate': startDate.format("YYYY-MM-DD"),
            'edate': endDate.format("YYYY-MM-DD")
        }
        let completeUrl = toGetUrl(url, params);
        this.loggerService.scheduleLogger.verbose("CrawlFundPriceService " + completeUrl);
        const {data} = await this.httpService.get(completeUrl, config).toPromise();
        return data;
    }
}