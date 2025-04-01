import {postData} from "./fetchApi.tsx";
import IManga from "./types/IManga.ts";

export const SearchName = async (apiUri: string, name: string) : Promise<IManga[]> => {
    if(name === undefined || name === null || name.length < 1)
        return Promise.reject("name was not provided");
    return await postData(`${apiUri}/v2/Search/Name`, name) as Promise<IManga[]>;
}

export const SearchNameOnConnector = async (apiUri: string, connectorName: string, name: string) : Promise<IManga[]> => {
    if(connectorName === undefined || connectorName === null || connectorName.length < 1)
        return Promise.reject("connectorName was not provided");
    if(name === undefined || name === null || name.length < 1)
        return Promise.reject("name was not provided");
    return await postData(`${apiUri}/v2/Search/${connectorName}`, name) as Promise<IManga[]>;
}

export const SearchUrl = async (apiUri: string, url: string) : Promise<IManga> => {
    if(url === undefined || url === null || url.length < 1)
        return Promise.reject("name was not provided");
    return await postData(`${apiUri}/v2/Search/Url`, url) as Promise<IManga>;
}