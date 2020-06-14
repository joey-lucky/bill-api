import {Injectable, NestMiddleware} from "@nestjs/common";
import {Assert} from "../utils/Assert";
import {AuthService} from "../service/auth";

@Injectable()
export class TokenMiddleware implements NestMiddleware {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    async use(req: Request|any, res: Response, next: Function) {
        if (req.originalUrl.indexOf("/safe/login") === -1) {
            const authorization: string = req.headers.authorization;
            Assert.hasText(authorization, "header authorization is null");
            const token = authorization.replace("Bearer ", "");
            const user = await this.authService.verifyToken(token);
            Assert.notNull(user, "用户不存在");
            req.user = user;
        }
        next();
    }
}