export default class StringUtils {
    static hasText(str) {
        if (typeof str === "number") {
            str = "" + str;
        }
        return str && str.length > 0;
    }
}