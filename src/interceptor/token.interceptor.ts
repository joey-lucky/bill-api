import {CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor} from "@nestjs/common";
import {LoggerService} from "../service/logger";
import {Observable, of} from "rxjs";
import {tap} from 'rxjs/operators';
import {ResponseBody, ResponseService} from "../service/response";
import {Assert} from "../utils/Assert";
import {AuthService} from "../service/auth";

@Injectable()
export class TokenInterceptor implements NestInterceptor {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    async intercept(context: ExecutionContext, next: CallHandler<any>):Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        if (req.originalUrl.indexOf("/safe/login") === -1) {
            try{
                const authorization: string = req.headers.authorization;
                Assert.hasText(authorization, "header authorization is null");
                const token = authorization.replace("Bearer ", "");
                const user = await this.authService.verifyToken(token);
                Assert.notNull(user, "用户不存在");
                req.user = user;
            }catch (e) {
                throw new HttpException(e.message, 401);
            }
        }
        return next.handle();
    }
}