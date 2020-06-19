export function toGetUrl(url:string,params:any):string {
    let paramStr = "";
    Object.keys(params).forEach(key => {
        let value = params[key] || "";
        paramStr += `&${key}=${value}`;
    });
    return url + (paramStr.replace("&", "?"));
}

