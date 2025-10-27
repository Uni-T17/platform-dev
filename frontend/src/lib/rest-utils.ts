export class RestClientException {
    constructor(readonly message:string[]){}
}


export function queryString(form : {[key: string] : any}) {
    const searchParams = new URLSearchParams

    Object.keys(form).forEach(key => {
        searchParams.append(key, form[key])
    })

    return searchParams.toString()
}


export const POST_CONFIG:RequestInit = {
    method : "POST",
    headers : {
        "Content-Type" : "application/json"
     }
}

export const PUT_CONFIG:RequestInit = {
    method : "PUT",
    headers : {
        "Content-Type" : "application/json"
     }
}