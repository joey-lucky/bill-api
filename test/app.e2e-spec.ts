import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import *as moment from "moment";

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // const moduleFixture = await Test.createTestingModule({
    //   imports: [AppModule],
    // }).compile();
    //
    // app = moduleFixture.createNestApplication();
    // await app.init();
  });

  it('/ (GET)', () => {
    console.log(moment().isoWeekday());
    console.log(moment().startOf("isoWeek").format("YYYY-MM-DD"));
    console.log(moment().endOf("isoWeek").format("YYYY-MM-DD"));
  });
});
