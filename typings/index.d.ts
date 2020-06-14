import {BcUser} from "../src/database";

declare module 'express'{
    interface Request {
        user:BcUser
    }
}