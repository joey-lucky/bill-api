import {BaseSchedule} from "../schedule.domain";
import * as moment from "moment";
import {Moment} from "moment";
import {toGetUrl} from "../../utils/url.utils";
import {BcFund, BdFundPrice} from "../../database";
import * as cheerio from "cheerio";
import {Assert} from "../../utils/Assert";
import {Cron, Timeout} from "@nestjs/schedule";
import {IsNull, Not} from "typeorm";
import {sleep} from "../../utils/promise.utils";

export class CrawlFundPriceService extends BaseSchedule {
    getScheduleName(): string {
        return "爬数据(基金净值)"
    }

    @Cron("0 0 1 * * *")
    async schedule1() {
        await this.subscribe();
    }

    @Timeout(1000)
    async schedule2() {
        await this.subscribe();
    }

    async subscribe(): Promise<any> {
        const fundList = await this.dbService.find(BcFund, {where: {startDate: Not(IsNull())}})
        this.log("待爬基金数：" + fundList.length);
        for (let fund of fundList) {
            try {
                await this.startCrawl(fund);
            } catch (e) {
            }
        }
    }

    async startCrawl(fund: BcFund) {
        this.logItem(fund.name, "开始");
        let minStartTime = moment(fund.startDate);
        let maxEndTime = moment().startOf("day").add(-1, "day");
        let [minDateTime, maxDateTime] = await this.getDateTimeRange(fund);
        if (minDateTime === null) {
            await this.crawlFundPriceData(fund, minStartTime, maxEndTime)
        } else {
            await this.crawlFundPriceData(fund,
                minStartTime,
                moment(minDateTime).startOf("day").add(-1, "day")
            );
            await this.crawlFundPriceData(fund,
                moment(maxDateTime).startOf("day").add(1, "day"),
                maxEndTime
            )
        }
        this.logItem(fund.name, "结束");
    }

    async getDateTimeRange(fund: BcFund): Promise<[Date, Date]> {
        // language=MySQL
        let sql = `
            select max(t.date_time) as maxDateTime,
                   min(t.date_time) as minDateTime
            from bd_fund_price t
            where t.fund_id = @fundId
        `;
        let data = await this.dbService.query(sql, {fundId: fund.id})
        let model = data[0];
        return [model.minDateTime, model.maxDateTime];
    }

    async crawlFundPriceData(fund: BcFund, startTime: Moment, endTime: Moment) {
        this.logItem(fund.name, `开始：${startTime.format("YYYY-MM-DD")} 至 ${endTime.format("YYYY-MM-DD")}`);
        let curr = endTime;
        while (!curr.isBefore(startTime)) {
            try {
                let end = curr;
                let start = curr.clone().add(-9, "day");
                if (start.isBefore(startTime)) {
                    start = startTime;
                }
                curr = start.clone().add(-1, "day");
                let html = await this.crawlRemoteHtml(fund, start, end);
                let entities = await this.htmlToEntity(html);
                this.logItem(fund.name, "爬取数量：" + entities.length);
                await this.savePriceEntity(fund, entities, start, end);
            } catch (e) {

            }
        }
    }

    // 将html解析成entity
    async htmlToEntity(html: string): Promise<BdFundPrice[]> {
        const result: BdFundPrice[] = []
        cheerio.load(html)("tbody tr").each(function (i, elem) {
            try {
                const datetime = elem.children[0].children[0].data;
                const price = elem.children[1].children[0].data;
                const percent = elem.children[3].children[0].data;
                const bdFundPrice = new BdFundPrice();
                bdFundPrice.dateTime = moment(datetime, "YYYY-MM-DD").toDate();
                bdFundPrice.price = Number.parseFloat(price);
                bdFundPrice.increase = Number.parseFloat(percent.replace("%", ""));
                result.push(bdFundPrice);
            } catch (e) {
            }
        })
        return result;
    }

    // http://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&code=110022&sdate=2020-01-01&edate=2020-06-01
    async crawlRemoteHtml(fund: BcFund, startDate: Moment, endDate: Moment): Promise<string> {
        const dayCount = startDate.diff(endDate, "day") + 1;
        const url = "http://fund.eastmoney.com/f10/F10DataApi.aspx";
        const config = {headers: {'Content-Type': 'text/html; charset=utf-8'}};
        const params = {
            'type': 'lsjz',
            'code': fund.code,
            'page': 1,
            'per': dayCount,
            'sdate': startDate.format("YYYY-MM-DD"),
            'edate': endDate.format("YYYY-MM-DD")
        }
        let start = Date.now();
        let completeUrl = toGetUrl(url, params);
        this.logItem(fund.name, completeUrl + ` (${Date.now() - start}ms)`,)
        const {data} = await this.httpService.get(completeUrl, config).toPromise();
        await sleep(2000);
        return data;
    }

    // 填充式保存，确保每个时间都有数据
    async savePriceEntity(fund: BcFund, entities: BdFundPrice[] = [],
                          start: Moment, end: Moment) {
        Assert.hasText(fund.id, "fund id is null");
        start = start.startOf("day");
        end = end.startOf("day");
        let saveData: BdFundPrice[] = [...entities];
        let timeSet: Set<number> = new Set();
        for (let item of saveData) {
            timeSet.add(item.dateTime.getTime());
        }
        let curr = start.clone();
        while (!curr.isAfter(end)) {
            if (!timeSet.has(curr.toDate().getTime())) {
                let entity = new BdFundPrice();
                entity.dateTime = curr.toDate();
                saveData.push(entity);
            }
            curr = curr.add(1, "day");
        }
        for (let item of saveData) {
            item.fundId = fund.id;
            item.createBy = "schedule";
            await item.save();
        }
    }
}