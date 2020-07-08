import {MiddlewareConsumer, Module} from '@nestjs/common';
import {routes} from "./controller";
import {ScheduleModule} from "./schedule/schedule.module";
import {GlobalModule} from "./global.module";

@Module({
    imports: [
        GlobalModule,
        ScheduleModule,
        ...routes,
    ],
    providers: [],
    controllers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
    }
}
