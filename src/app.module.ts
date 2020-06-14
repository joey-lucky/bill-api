import {MiddlewareConsumer, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {routes} from "./controller";
import {tables, views} from "./database";
import {ConfigService} from "./service/config";
import {TokenMiddleware} from "./middleware/token.middleware";
import {ScheduleModule} from "./schedule/schedule.module";
import {GlobalModule} from "./global.module";

@Module({
    imports: [
        GlobalModule,
        ScheduleModule,
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                ...configService.getTypeormConfig(),
                entities: [...tables, ...views]
            }),
        }),
        ...routes,
    ],
    providers: [],
    controllers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        // consumer.apply(TokenMiddleware).forRoutes("*");
    }
}
