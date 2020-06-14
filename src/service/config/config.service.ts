import * as defConfig from "../../../config/config.default.js";
import * as prodConfig from "../../../config/config.prod.js";
import * as devConfig from "../../../config/config.dev.js";
import * as testConfig from "../../../config/config.test.js";
import {Injectable} from "@nestjs/common";

@Injectable()
export class ConfigService {
    private readonly nodeEnv: string = process.env.NODE_ENV;
    private config: any;

    constructor() {
        this.init()
    }

    getSecret() {
        return this.config.secret;
    }

    getTypeormConfig(){
        return this.config.typeorm;
    }

    isProd() {
        return !this.nodeEnv || this.nodeEnv === "production";
    }

    isDev() {
        return this.nodeEnv === "development"
    }

    isTest() {
        return this.nodeEnv === "test";
    }

    init() {
        const envConfig = this.isDev() ? devConfig : this.isTest() ? testConfig : prodConfig;
        const config = {...defConfig};
        for (let key of Object.keys(envConfig)) {
            let value = envConfig[key];
            let defValue = config[key];
            config[key] = this.mergeConfigValue(defValue, value);
        }
        this.config = config;
    }

    private mergeConfigValue(defValue: any, value: any) {
        if (!defValue) {
            return value;
        }
        if (typeof value === "string") {
            return value;
        } else {
            return {...defValue, ...value};
        }
    }
}