import { RestClientException } from "./rest-utils";
import { BASEURL } from "./url";

export async function request(path:string, init : RequestInit = {}) {

    const endpoint = `${BASEURL}/${path}`

    const response = await fetch(endpoint, init)

    if(!response.ok) {
        const message = await response.json() as string[]
        throw new RestClientException(message)
    }
    
    return response
    
}