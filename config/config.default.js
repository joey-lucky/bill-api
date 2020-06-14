module.exports = {
    secret:"hjoey",
    typeorm:{
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'bill_dev',
        synchronize: true,
        logging: [
            "query",
            "error",
            "warn",
            "info",
            "log"
        ],
    }
};