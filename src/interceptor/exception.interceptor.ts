import {CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable, of} from "rxjs";
import {ResponseService} from "../service/response";
import {catchError} from 'rxjs/operators';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
    constructor(
        private readonly responseService: ResponseService
    ) {
    }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        return next.handle().pipe(
            catchError((e) => {
                let res = context.switchToHttp().getResponse();
                let message:string = e.message || "";
                if (e instanceof HttpException) {
                    res.statusCode = e.getStatus();
                } else {
                    res.statusCode = HttpStatus.BAD_REQUEST;
                }
                if (message.includes("ER_ROW_IS_REFERENCED")) {
                    message = "外键约束" + " ER_ROW_IS_REFERENCED";
                }
                return of(this.responseService.fail(message));
            })
        )
    }
}