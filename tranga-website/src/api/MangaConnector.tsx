import {getData, patchData} from './fetchApi.tsx';
import IMangaConnector from "./types/IMangaConnector.ts";

export const GetAllConnectors = async (apiUri: string) : Promise<IMangaConnector[]> => {
    return await getData(`${apiUri}/v2/MangaConnector`) as Promise<IMangaConnector[]>
}

export const GetConnector = async (apiUri: string, mangaConnectorName: string) : Promise<IMangaConnector> => {
    return await getData(`${apiUri}/v2/MangaConnector/${mangaConnectorName}`) as Promise<IMangaConnector>;
}

export const  GetEnabledConnectors = async (apiUri: string) : Promise<IMangaConnector[]> => {
    return await getData(`${apiUri}/v2/MangaConnector/enabled`) as Promise<IMangaConnector[]>
}

export const  GetDisabledConnectors = async (apiUri: string) : Promise<IMangaConnector[]> => {
    return await getData(`${apiUri}/v2/MangaConnector/disabled`) as Promise<IMangaConnector[]>
}

export const  SetConnectorEnabled = async (apiUri: string, connectorName: string, enabled: boolean) : Promise<object | undefined> => {
    if(connectorName === undefined || connectorName === null || connectorName.length < 1)
        return Promise.reject("connectorName was not provided");
    if(enabled === undefined || enabled === null)
        return Promise.reject("enabled was not provided");
    return await patchData(`${apiUri}/v2/MangaConnector/${connectorName}/SetEnabled/${enabled}`, {});
}