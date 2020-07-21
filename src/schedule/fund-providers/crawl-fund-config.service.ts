import {BaseSchedule} from "../schedule.domain";
import {BcFund} from "../../database";
// import {Cron, Timeout} from "@nestjs/schedule";

export class CrawlFundConfigService extends BaseSchedule {
    getScheduleName(): string {
        return "爬数据(基金列表)"
    }

    // @Cron("0 0 0 * * *")
    async schedule1() {
        await this.subscribe();
    }

    // @Timeout(1000)
    async schedule2() {
        await this.subscribe();
    }

    async subscribe(): Promise<any> {
        try{
            this.log("开始")
            let str = await this.crawlRemoteData();
            let entities = await this.dataToEntity(str);
            this.log("数量：" + entities.length);
            let needSaveEntities =await this.getNeedInsertEntities(entities);
            this.log("需要新增数量：" + needSaveEntities.length);
            for (let item of needSaveEntities) {
                await item.save();
            }
            this.log("结束")
        }catch (e) {
            this.log("失败", e);
        }
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
        this.log(completeUrl);
        const {data} = await this.httpService.get(completeUrl, config).toPromise();
        return data;
    }

    private async getNeedInsertEntities(entities: BcFund[]):Promise<BcFund[]> {
        const fundList = await BcFund.find();
        let codeSet = new Set(fundList.map(item => item.code));
        return entities.filter(item => !codeSet.has(item.code));
    }
}