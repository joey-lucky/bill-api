import {AssertException} from "../service/response/response.exception";

export class Assert {
    static isTrue(needTrue: boolean, msg?) {
        if (!needTrue) {
            throw new AssertException(msg || "expect true but false");
        }
    }

    static notNull(str, msg?) {
        const undefinedMsg = msg || "expect not null but undefined";
        const nullMsg = msg || "expect not null but null";
        Assert.isTrue(str !== null, nullMsg);
        Assert.isTrue(str !== undefined, undefinedMsg);
    }

    static hasText(str: string, msg?) {
        const nullMsg = msg || "expect has text but null";
        const emptyTextMsg = msg || "expect has text but text length = 0";
        Assert.notNull(str, nullMsg);
        Assert.isTrue(str.length !== 0, emptyTextMsg);
    }

    static equal(expect, value, msg?) {
        Assert.isTrue(typeof expect === typeof value, msg || "expect equal but type is different");
        if (typeof expect === "string") {
            Assert.isTrue(expect === value, msg || `expect ${expect} but ${value}`);
        } else {
            Assert.isTrue(expect === value, msg || "expect equal but different");
        }
    }

    static notEmpty(list, msg?) {
        Assert.notNull(list, msg || "expect not empty but null");
        Assert.notNull(list.length > 0, msg || "expect not empty but empty");
    }
}

