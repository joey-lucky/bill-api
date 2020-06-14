import {PageInfo, ResponseBody} from "./response.domain";

export class ResponseService {
    fail(v: string | Error): ResponseBody {
        if (typeof v === "string") {
            return {code: "0", message: v, data: []};
        } else if (v instanceof Error) {
            return {code: "0", message: v.message, data: []};
        }
        return {code: "0", message: "", data: []}
    }

    success(data = [], message: string = ""): ResponseBody {
        return {code: "1", data: data, message};
    }

    successPage(pageInfo: PageInfo, data = [], message: string = ""): ResponseBody {
        return {code: "1", data: data, message, pageInfo};
    }
}