import {Injectable, Logger as NestLogger} from "@nestjs/common";
import {LoggerService as NestService} from "@nestjs/common/services/logger.service";
import {QueryRunner,Logger as TypeOrmLogger} from "typeorm";
import {configure, getLogger, Logger} from "log4js";
import moment = require("moment");
import * as path from "path";

class CommonLogger implements NestService {
    private readonly logger: Logger;
    private readonly loggerName: string;

    constructor(loggerName: string) {
        this.loggerName = loggerName;
        this.logger = getLogger(loggerName);
    }

    error(message: any, trace?: string): any {
        return this.logger.error(`${message}`, trace);
    }

    log(message: any): any {
        return this.logger.info(`${message}`);
    }

    warn(message: any): any {
        return this.logger.warn(`${message}`);
    }

    debug(message: any): any {
        return this.logger.debug(`${message}`);
    }

    verbose(message: any): any {
        return this.logger.trace(`${message}`);
    }
}

class DbLogger implements TypeOrmLogger {
    logService = new CommonLogger("database");

    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): any {
        if (level === "warn") {
            this.logService.warn(this.toSimpleSql(message));
        } else if (level === "info") {
            this.logService.verbose(this.toSimpleSql(message));
        } else {
            this.logService.log(this.toSimpleSql(message));
        }
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        this.logService.verbose(this.toSimpleSql(message));
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logService.verbose(this.toSimpleSql(query, parameters));
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logService.error(this.toSimpleSql(query, parameters), error);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logService.verbose(this.toSimpleSql(query, parameters) + `\t(${time}ms)`);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        this.logService.verbose(this.toSimpleSql(message));
    }

    toSimpleSql(sql: string, parameters?: any[]) {
        sql = sql.replace(/[\n\t]/g, "  ");
        sql = sql.replace(/[\s]{2,9999}/g, " ");
        if (sql.startsWith(" ")) {
            sql = sql.replace(" ", "");
        }
        let parameterStr = "";
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
    public readonly scheduleLogger:CommonLogger;
    public readonly requestLogger:CommonLogger;
    public readonly dbLogger;

    constructor() {
        configure({
            pm2: true,
            pm2InstanceVar: 'INSTANCE_ID',
            appenders: {
                console: {
                    type: 'console',
                    layout: {
                        type: "colored"
                    }
                },
                databaseFile: {
                    type: 'DateFile',
                    filename: path.resolve(".","logs/database"),
                    pattern: '.yyyyMMdd.log',
                    alwaysIncludePattern: true,
                },
                requestFile: {
                    type: 'DateFile',
                    filename: path.resolve(".","logs/request"),
                    pattern: '.yyyyMMdd.log',
                    alwaysIncludePattern: true,
                },
                scheduleFile:{
                    type: 'DateFile',
                    filename: path.resolve(".","logs/schedule"),
                    pattern: '.yyyyMMdd.log',
                    alwaysIncludePattern: true,
                },
            },
            categories: {
                default: {
                    appenders: ['console'],
                    level: 'all'
                },
                schedule:{
                    appenders: ['console', "scheduleFile"],
                    level: 'all'
                },
                request:{
                    appenders: ['console', "requestFile"],
                    level: 'all'
                }        ,
                database:{
                    appenders: ['console', "databaseFile"],
                    level: 'all'
                }
            }
        });
        this.scheduleLogger = new CommonLogger("schedule");
        this.requestLogger = new CommonLogger("request")
        this.dbLogger = new DbLogger();
    }
}