import {BcToken, BcUser, BdSendMessage} from "../../database";
import {Assert} from "../../utils/Assert";
import {HttpService, Inject, Injectable} from "@nestjs/common";
import {DbService} from "../../service/db";
import {LoggerService} from "../../service/logger";
import {Schedule} from "../schedule.domain";

@Injectable()
export class SendMessageService implements Schedule {
    @Inject()
    private readonly dbService: DbService;
    @Inject()
    private readonly loggerService: LoggerService;
    @Inject()
    private readonly httpService: HttpService

    static get schedule() {
        return {
            interval: "60s", // 60 分钟间隔
            type: "worker", // 指定所有的 worker 都需要执行
            immediate: false,
        };
    }

    subscribe = async () => {
        try {
            const entityList: BdSendMessage[] = await this.dbService.find(BdSendMessage, {
                where: {
                    sendStatus: "0",
                },
            });
            for (const entity of entityList) {
                await this.sendMessage(entity);
            }
            this.loggerService.scheduleLogger.verbose("SendMessageSchedule success");
        } catch (e) {
            this.loggerService.scheduleLogger.verbose("SendMessageSchedule error " + e.message);
            throw e;
        }
    }

    async sendMessage(entity: BdSendMessage) {
        const {msgContent, userId, tokenId} = entity;
        try {
            const tokenEntity: BcToken = await this.dbService.findOne(BcToken, tokenId);
            const user = await this.dbService.findOne(BcUser, userId);
            const {bussWx} = user;
            Assert.hasText(bussWx, "企业微信号不存在");
            let url = "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=" + tokenEntity.accessToken;
            let data = {
                // "access_token": tokenEntity.accessToken,
                touser: bussWx,
                // "toparty" : "PartyID1|PartyID2",
                // "totag" : "TagID1 | TagID2",
                msgtype: "text",
                agentid: tokenEntity.agentId,
                text: {
                    content: msgContent,
                },
                safe: 0,
                enable_id_trans: 0,
                enable_duplicate_check: 0,
            };
            let config = {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            };
            let response: any = await this.httpService.post(url, data, config).toPromise();
            Assert.isTrue(response.errcode === 0, "errcode不为0");
            await entity.save();
        } catch (e) {
            entity.errorCode = "0";
            this.loggerService.scheduleLogger.error("SendMessageSchedule 消息发送失败 " + entity.id + e.message);
        }
        entity.sendStatus = "1";
        entity.sendTime = new Date();
        await entity.save();
    }
}