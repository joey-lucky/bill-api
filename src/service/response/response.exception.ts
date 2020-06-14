import {HttpException, HttpStatus} from "@nestjs/common";

export class AssertException extends HttpException {
    constructor(msg: string) {
        super(msg, HttpStatus.BAD_REQUEST);
    }
}