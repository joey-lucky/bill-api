import {LessThanOrEqual} from "typeorm";
import {BcToken} from "../../database";
import {Assert} from "../../utils/Assert";
import {BaseSchedule} from "../schedule.domain";
import {Interval} from "@nestjs/schedule";

export class GenerateTokenService extends BaseSchedule {
    private static EXPIRES_THRESHOLD = 20 * 60 * 1000;

    getScheduleName(): string {
        return "获取(微信企业号Token)"
    }

    @Interval(60 * 1000)
    async subscribe() {
        if (!this.isProd()) return;
        try {
            this.log("开始");
            const tokenEntityList = await this.dbService.find(BcToken, {
                where: {
                    expiresIn: LessThanOrEqual(new Date(Date.now() - GenerateTokenService.EXPIRES_THRESHOLD)),
                },
            });
            for (const entity of tokenEntityList) {
                await this.refreshQYWeChat(entity);
            }
            this.log("结束");
        } catch (e) {
            this.log("失败", e);
        }
    }

    async refreshQYWeChat(tokenEntity: BcToken) {
        this.logItem(tokenEntity.agentId + "", "开始");
        const {secret, corpId} = tokenEntity;
        let url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpId}&corpsecret=${secret}`;
        let config = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };
        const {data} = await this.httpService.get(url, config).toPromise();
        try {
            Assert.isTrue(data.errcode === 0, "errcode不为0");
            tokenEntity.accessToken = data["access_token"];
            tokenEntity.expiresIn = new Date(data["expires_in"] * 1000 + Date.now());
            await tokenEntity.save();
            this.logItem(tokenEntity.agentId + "", "结束");
        } catch (e) {
            this.logItem(tokenEntity.agentId + "", "失败", e);
        }
    }
}