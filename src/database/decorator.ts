import {
    Column as TypeOrmColumn,
    ColumnOptions,
    Entity as TypeOrmEntity,
    EntityOptions,
    ViewEntity as TypeOrmViewEntity
} from "typeorm";
import * as moment from "moment";
import {ViewEntityOptions} from "typeorm/decorator/options/ViewEntityOptions";

export function Column(options: ColumnOptions = {}) {
    return function (object: Object, propertyName: string) {
        options.name = propertyName.replace(/([A-Z]|[0-9]+)/g, (str) => "_" + str.toLowerCase());
        let defOptions: ColumnOptions = {
            nullable: true
        };
        TypeOrmColumn({...defOptions, ...options})(object, propertyName);
    };
}

export function DateTimeColumn() {
    return Column({
        type: "datetime",
        nullable: true,
        transformer: {
            from: (date: Date) => date && moment(date).format("YYYY-MM-DD HH:mm:ss"),
            to: (date: string | Date) => {
                if (typeof date === "string") {
                    return moment(date).toDate();
                }
                return date;
            },
        },
    });
}

// BcUser --> bc_user
export function Entity(options?: EntityOptions): Function {
    return function (target: Function) {
        let tableName = target.name.replace(/([A-Z]|[0-9]+)/g, (str) => "_" + str.toLowerCase()).substr(1);
        TypeOrmEntity(tableName, options)(target);
    };
}

// BcUser --> bc_user
export function ViewEntity(options: ViewEntityOptions = {}): Function {
    return function (target: Function) {
        let tableName = target.name.replace(/([A-Z]|[0-9]+)/g, (str) => "_" + str.toLowerCase()).substr(1);
        options.name = tableName;
        TypeOrmViewEntity(options)(target);
    };
}
