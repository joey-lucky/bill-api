import {Injectable, Logger as NestLogger} from "@nestjs/common";
import {LoggerService as NestService} from "@nestjs/common/services/logger.service";

class Logger implements NestService {
    private readonly logger:NestLogger;
    private readonly loggerName:string;

    constructor(loggerName:string) {
        this.loggerName = loggerName;
        this.logger = new NestLogger(loggerName);
    }

    error(message: any, trace?: string, context?: string): any {
        return  this.logger.error(`${message}`, trace, context);
    }

    log(message: any, context?: string): any {
        return  this.logger.log(`${message}`, context);
    }

    warn(message: any, context?: string): any {
        return  this.logger.warn(`${message}`, context);
    }

    debug(message: any, context?: string): any {
        return this.logger.debug(`${message}`, context);
    }

    verbose(message: any, context?: string): any {
        return this.logger.verbose(`${message}`, context);
    }
}


@Injectable()
export class LoggerService{
    public readonly scheduleLogger = new Logger("schedule")
    public readonly requestLogger = new Logger("request")
}