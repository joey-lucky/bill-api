import {LessThanOrEqual} from "typeorm";
import {BcToken} from "../../database";
import {Assert} from "../../utils/Assert";
import {HttpService, Inject, Injectable} from "@nestjs/common";
import {DbService} from "../../service/db";
import {LoggerService} from "../../service/logger";
import {Schedule} from "../schedule.domain";

@Injectable()
export class GenerateTokenService implements Schedule{
    @Inject()
    private readonly dbService: DbService;
    @Inject()
    private readonly loggerService: LoggerService;
    @Inject()
    private readonly httpService: HttpService

    private static EXPIRES_THRESHOLD = 20 * 60 * 1000;

    static get schedule() {
        return {
            interval: "60s", // 60 分钟间隔
            type: "worker", // 指定所有的 worker 都需要执行
            immediate: false,
        };
    }

    subscribe = async () => {
        try {
            const tokenEntityList = await this.dbService.find(BcToken, {
                where: {
                    expiresIn: LessThanOrEqual(new Date(Date.now() - GenerateTokenService.EXPIRES_THRESHOLD)),
                },
            });
            for (const entity of tokenEntityList) {
                await this.refreshQYWeChat(entity);
            }
            this.loggerService.scheduleLogger.verbose("TokenSchedule success");
        } catch (e) {
            this.loggerService.scheduleLogger.error("TokenSchedule error " + e.message);
            throw e;
        }
    }

    async refreshQYWeChat(tokenEntity: BcToken) {
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
        } catch (e) {
            this.loggerService.scheduleLogger.error("TokenSchedule 企业微信token获取失败 " + e.message);
        }
    }
}