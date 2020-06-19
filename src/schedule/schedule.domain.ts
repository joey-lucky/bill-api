import {HttpService, Inject} from "@nestjs/common";
import {LoggerService} from "../service/logger";
import {DbService} from "../service/db";

export interface Schedule {
    subscribe(): Promise<any>;

    getScheduleName?(): string;
}

export abstract class BaseSchedule implements Schedule {
    @Inject()
    protected readonly httpService: HttpService
    @Inject()
    protected readonly dbService: DbService;
    @Inject()
    protected readonly loggerService: LoggerService;

    abstract subscribe(): Promise<any>;

    abstract getScheduleName(): string;

    protected logItem(itemName: string, msg: string, error?: Error) {
        let itemMsg = "";
        if (itemName) {
            itemMsg = " " + itemName;
        }
        let content = `${this.getScheduleName()}${itemMsg} ${msg}`;
        if (error) {
            this.loggerService.scheduleLogger.error(content,error.stack);
        }else {
            this.loggerService.scheduleLogger.verbose(content)
        }
    }

    protected log(msg: string, error?: Error) {
        this.logItem(null, msg, error);
    }
}
