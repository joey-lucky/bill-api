import {MiddlewareConsumer, Module} from '@nestjs/common';
import {ScheduleModule} from "./schedule/schedule.module";
import {GlobalModule} from "./global.module";
import {routes} from "./controller";

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
