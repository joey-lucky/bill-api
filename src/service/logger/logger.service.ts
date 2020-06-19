import {Injectable, Logger as NestLogger} from "@nestjs/common";
import {LoggerService as NestService} from "@nestjs/common/services/logger.service";
import {Logger} from "typeorm/logger/Logger";
import {QueryRunner} from "typeorm";
import moment = require("moment");

class CommonLogger implements NestService {
    private readonly logger: NestLogger;
    private readonly loggerName: string;

    constructor(loggerName: string) {
        this.loggerName = loggerName;
        this.logger = new NestLogger(loggerName);
    }

    error(message: any, trace?: string, context?: string): any {
        return this.logger.error(`${message}`, trace, context);
    }

    log(message: any, context?: string): any {
        return this.logger.log(`${message}`, context);
    }

    warn(message: any, context?: string): any {
        return this.logger.warn(`${message}`, context);
    }

    debug(message: any, context?: string): any {
        return this.logger.debug(`${message}`, context);
    }

    verbose(message: any, context?: string): any {
        return this.logger.verbose(`${message}`, context);
    }
}

class DbLogger implements Logger {
    logService = new CommonLogger("database");

    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): any {
        if (level === "warn") {
            this.logService.warn(message);
        } else if (level === "info") {
            this.logService.verbose(message);
        } else {
            this.logService.log(message);
        }
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logService.verbose(this.toSimpleSql(query,parameters));
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logService.error(this.toSimpleSql(query,parameters), error);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logService.verbose(this.toSimpleSql(query,parameters) + `\t(${time}ms)`);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {

    }

    toSimpleSql(sql: string, parameters?: any[]) {
        sql = sql.replace(/(\n|\t)/g, "   ");
        sql = sql.replace(/[\s]{2}/g, "");
        if (sql.startsWith(" ")) {
            sql = sql.replace(" ", "");
        }

        let parameterStr ="";
        if (parameters) {
            parameters = parameters.map(item => {
                if (item instanceof Date) {
                    return moment(item).format("YYYY-MM-DD HH:mm:ss");
                } else {
                    return item;
                }
            });
            parameterStr = parameters.toString();
        }
        return sql + ` [${parameterStr}]`;
    }

}

@Injectable()
export class LoggerService {
    public readonly scheduleLogger = new CommonLogger("schedule")
    public readonly requestLogger = new CommonLogger("request")
    public readonly dbLogger = new DbLogger()
}