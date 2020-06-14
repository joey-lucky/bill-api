import {ConfigService} from './config.service';
import assert = require("power-assert");

describe('ConfigService', () => {
    let service: ConfigService = new ConfigService();

    beforeEach(async () => {
        service = new ConfigService();
    });

    it('test', () => {
        // @ts-ignore
        service.nodeEnv = "test";
        service.init();
        assert.deepEqual(service.getSecret(),"hjoey");
        assert.deepEqual(service.getTypeormConfig().database, "bill_test");
        assert.deepEqual(service.getTypeormConfig().synchronize, true);
    });
    it('prod', () => {
        // @ts-ignore
        service.nodeEnv = "production";
        service.init();
        assert.deepEqual(service.getSecret(),"hjoey");
        assert.deepEqual(service.getTypeormConfig().database, "bill");
        assert.deepEqual(service.getTypeormConfig().synchronize, false);
    });
    it('dev', () => {
        // @ts-ignore
        service.nodeEnv = "development";
        service.init();
        assert.deepEqual(service.getSecret(),"hjoey");
        assert.deepEqual(service.getTypeormConfig().database, "bill_dev");
        assert.deepEqual(service.getTypeormConfig().synchronize, true);
    });
});
