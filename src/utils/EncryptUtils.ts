import * as crypto from "crypto";

export interface TokenObject {
    userId: string;
    expires: number;
}

export default class EncryptUtils {
    private static readonly SECRET_KEY = "joey";

    public static encrypt(str): string {
        const cipher = crypto.createCipher("aes192", EncryptUtils.SECRET_KEY);
        let result = cipher.update(str, "utf8", "hex");
        result += cipher.final("hex");
        return result; //编码方式从utf-8转为hex;
    }

    public static decrypt(token): string {
        const decipher = crypto.createDecipher("aes192", EncryptUtils.SECRET_KEY);
        let result = decipher.update(token, "hex", "utf8");
        result += decipher.final("utf8");
        return result;
    }

    public static decryptToken(token): TokenObject {
        const result  = EncryptUtils.decrypt(token);
        return JSON.parse(result);
    }

    public static generateToken(userId): string {
        const tokenObj: TokenObject = {userId, expires: Date.now()};
        const str = JSON.stringify(tokenObj);
        return EncryptUtils.encrypt(str);
    }
}