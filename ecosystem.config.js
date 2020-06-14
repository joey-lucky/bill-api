module.exports = {
    apps: [
        {
            name: "bill-api",
            script: 'dist/src/main.js',
            env: {
                NODE_ENV: 'production' //启动默认模式
            },
        },
    ],
};
