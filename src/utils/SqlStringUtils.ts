export default class SqlStringUtils {

    static getNumOfQuestionMark(num: number): string|undefined {
        if (num <= 0) {
            return undefined;
        }else {
            let result = "";
            for (let i = 0; i < num; i++) {
                result += "?,";
            }
            return result.substr(0, result.length - 1);
        }
    }

}