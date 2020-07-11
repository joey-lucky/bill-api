function toSimpleSql(sql, parameters) {
    sql = sql.replace(/[^_@\.\-\:0-9a-zA-Z]/g, " ");
    sql = sql.replace(/[\s]{2,9999}/g, " ");
    sql = sql.replace(/\s\.\s/g, ".");
    if (sql.startsWith(" ")) {
        sql = sql.replace(" ", "");
    }
    let parameterStr = "";
    if (parameters) {
        parameters = parameters.map(item => {
            if (item instanceof Date) {
                return moment(item).format("YYYY-MM-DD HH:mm:ss");
            } else {
                return item;
            }
        });
        parameterStr = parameters.toString();
    }
    return sql + ` [${parameterStr}]`;
}

let a = "CREATE TABLE bill_dev . typeorm_metadata type varchar 255 NOT NULL database ";
console.log(toSimpleSql(a))