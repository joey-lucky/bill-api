import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {LoggerService} from "../service/logger";
import {Observable} from "rxjs";
import {tap} from 'rxjs/operators';
import {ResponseBody} from "../service/response";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    constructor(
        private readonly loggerService: LoggerService
    ) {
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const startTime = Date.now();
        return next.handle().pipe(
            tap((result: ResponseBody) => {
                let res = context.switchToHttp().getResponse();
                const delay = Date.now() - startTime;
                const length = result && result.data && result.data.length;
                let message = ` ${req.originalUrl} data-length=${length} (${delay}ms) ${res.statusCode}`;
                this.loggerService.requestLogger.verbose(message);
            })
        );
    }
}