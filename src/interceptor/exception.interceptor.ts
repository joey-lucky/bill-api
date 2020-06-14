import {CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable, of} from "rxjs";
import {ResponseBody, ResponseService} from "../service/response";
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
    constructor(
        private readonly responseService: ResponseService
    ) {
    }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        return next.handle().pipe(
            catchError(e => {
                let res = context.switchToHttp().getResponse();
                if (e instanceof HttpException) {
                    res.statusCode = e.getStatus();
                } else {
                    res.statusCode = HttpStatus.BAD_REQUEST;
                }
                return of(this.responseService.fail(e.message));
            })
        )
    }
}