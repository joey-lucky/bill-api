import {Inject, Injectable} from "@nestjs/common";
import {ConfigService} from "../config";
import * as jwt from "jsonwebtoken";
import {TokenPlayLoad} from "./auth.domain";
import {BcUser} from "../../database";
import {DbService} from "../db";

@Injectable()
export class AuthService {
    @Inject()
    private readonly configService: ConfigService;
    @Inject()
    private readonly dbService: DbService;

    async verifyToken(token:string):Promise<BcUser>{
        const secret = this.configService.getSecret();
        // @ts-ignore
        const playLoad: TokenPlayLoad = jwt.verify(token, secret);
        return await this.dbService.findOne(BcUser, playLoad.userId);
    }
}