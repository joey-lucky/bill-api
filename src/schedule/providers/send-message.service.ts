import {BcToken, BcUser, BdSendMessage} from "../../database";
import {Assert} from "../../utils/Assert";
import {BaseSchedule} from "../schedule.domain";
import {Interval} from "@nestjs/schedule";

export class SendMessageService extends BaseSchedule {
    getScheduleName(): string {
        return "消息推送(企业微信)"
    }

    @Interval(60 * 1000)
    async subscribe() {
        try {
            this.log("开始")
            const entityList: BdSendMessage[] = await this.dbService.find(BdSendMessage, {
                where: {
                    sendStatus: "0",
                },
            });
            for (const entity of entityList) {
                await this.sendMessage(entity);
            }
            this.log("结束")
        } catch (e) {
            this.log("失败", e)
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
            this.logItem(entity.id,"失败")
        }
        entity.sendStatus = "1";
        entity.sendTime = new Date();
        await entity.save();
    }
}