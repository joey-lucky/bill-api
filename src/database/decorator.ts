import {
    Column as TypeOrmColumn,
    ColumnOptions,
    Entity as TypeOrmEntity,
    EntityOptions,
    JoinColumn as TypeOrmJoinColumn,
    JoinColumnOptions,
    ViewEntity as TypeOrmViewEntity
} from "typeorm";
import * as moment from "moment";
import {ViewEntityOptions} from "typeorm/decorator/options/ViewEntityOptions";

// userId --> user_id
function parseCamelToColumnName(propertyName: string) {
    return propertyName.replace(/([A-Z]|[0-9]+)/g, (str) => "_" + str.toLowerCase());
}

export function Column(options: ColumnOptions = {}) {
    return function (object: Object, propertyName: string) {
        options.name = parseCamelToColumnName(propertyName);
        let defOptions: ColumnOptions = {
            nullable: true
        };
        TypeOrmColumn({...defOptions, ...options})(object, propertyName);
    };
}

export function JoinColumn(options: JoinColumnOptions = {}) {
    return function (object: Object, propertyName: string) {
        let defOpt: JoinColumnOptions = {};
        defOpt.name = parseCamelToColumnName(propertyName) + "_id";
        defOpt.referencedColumnName = "id";
        let mergeOpt = {...defOpt, ...options};
        TypeOrmJoinColumn(mergeOpt)(object, propertyName);
    };
}

export function DateTimeColumn(options:ColumnOptions={}) {
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
        ...options
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
