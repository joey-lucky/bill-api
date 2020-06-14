export interface PageInfo {
    pageIndex?: number;
    pageSize?: number;
    pageCount?: number;
    count?: number;
}

export interface ResponseBody {
    code: "0" | "1";
    data: any[];
    message: string | null;
    pageInfo?: PageInfo;
}
