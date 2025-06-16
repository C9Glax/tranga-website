import {createContext} from "react";

export const ApiUriContext = createContext<string>("");

export function getData(uri: string) : Promise<object | undefined> {
    return makeRequestWrapper("GET", uri, null);
}

export function postData(uri: string, content?: object | string | number | boolean | null) : Promise<object | undefined> {
    return makeRequestWrapper("POST", uri, content);
}

export function deleteData(uri: string) : Promise<void> {
    return makeRequestWrapper("DELETE", uri, null) as Promise<void>;
}

export function patchData(uri: string, content: object | string | number | boolean) : Promise<object | undefined> {
    return makeRequestWrapper("patch", uri, content);
}

export function putData(uri: string, content: object | string | number | boolean) : Promise<object | undefined> {
    return makeRequestWrapper("PUT", uri, content);
}

function makeRequestWrapper(method: string, uri: string, content?: object | string | number | null | boolean) : Promise<object | undefined>{
    return makeRequest(method, uri, content)
        .then((result) => result as Promise<object>)
        .catch((e) => {
            console.warn(e);
            return Promise.reject(e);
        });
}

let currentlyRequestedEndpoints: string[] = [];
function makeRequest(method: string, uri: string, content?: object | string | number | null | boolean) : Promise<object | void> {
    const id = method + uri;
    if(currentlyRequestedEndpoints.find(x => x == id) != undefined)
        return Promise.reject(`Already requested: ${method} ${uri}`);
    currentlyRequestedEndpoints.push(id);
    return fetch(uri,
        {
            method: method,
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: content ? JSON.stringify(content) : null
        })
        .then(function(response){
            if(!response.ok){
                if(response.status === 503){
                    currentlyRequestedEndpoints.splice(currentlyRequestedEndpoints.indexOf(id), 1)
                    let retryHeaderVal = response.headers.get("Retry-After");
                    let seconds = 10;
                    if(retryHeaderVal === null){
                        return response.text().then(text => {
                            seconds = parseInt(text);
                            return new Promise(resolve => setTimeout(resolve, seconds * 1000))
                                .then(() => {
                                    return makeRequest(method, uri, content);
                                });
                        });
                    }else {
                        seconds = parseInt(retryHeaderVal);
                        return new Promise(resolve => setTimeout(resolve, seconds * 1000))
                            .then(() => {
                                return makeRequest(method, uri, content);
                            });
                    }
                }else
                    throw new Error(response.statusText);
            }
            let json = response.json();
            return json.then((json) => json).catch(() => null);
        })
        .catch(function(err : Error){
            console.error(`Error ${method}ing Data ${uri}\n${err}`);
            return Promise.reject();
        }).finally(() => currentlyRequestedEndpoints.splice(currentlyRequestedEndpoints.indexOf(id), 1));
}

export function isValidUri(uri: string) : boolean{
    try {
        new URL(uri);
        return true;
    } catch (err) {
        return false;
    }
}