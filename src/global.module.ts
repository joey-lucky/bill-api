import {Global, Module} from "@nestjs/common";
import {DbService} from "./service/db";
import {ConfigService} from "./service/config";
import {ResponseService} from "./service/response";
import {AuthService} from "./service/auth";
import {LoggerService} from "./service/logger";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {LoggerInterceptor} from "./interceptor/logger.interceptor";
import {ExceptionInterceptor} from "./interceptor/exception.interceptor";
import {TokenInterceptor} from "./interceptor/token.interceptor";

@Global()
@Module({
    imports: [],
    providers: [
        DbService,
        ConfigService,
        ResponseService,
        AuthService,
        LoggerService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ExceptionInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TokenInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggerInterceptor,
        },
    ],
    exports: [
        DbService,
        ConfigService,
        ResponseService,
        AuthService,
        LoggerService,
    ],
})
export class GlobalModule {
}