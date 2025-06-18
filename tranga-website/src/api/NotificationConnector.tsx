import {deleteData, getData, putData} from "./fetchApi.tsx";
import INotificationConnector from "./types/INotificationConnector.ts";
import IGotifyRecord from "./types/records/IGotifyRecord.ts";
import INtfyRecord from "./types/records/INtfyRecord.ts";
import IPushoverRecord from "./types/records/IPushoverRecord.ts";

export const  GetNotificationConnectors = async (apiUri: string) : Promise<INotificationConnector[]> => {
    return await getData(`${apiUri}/v2/NotificationConnector`) as Promise<INotificationConnector[]>
}

export const  CreateNotificationConnector = async (apiUri: string, newConnector: INotificationConnector) : Promise<string> => {
    if(newConnector === undefined || newConnector === null)
        return Promise.reject("newConnector was not provided");
    return await putData(`${apiUri}/v2/NotificationConnector`, newConnector) as Promise<string>;
}

export const  GetNotificationConnectorWithId = async (apiUri: string, notificationConnectorId: string) : Promise<INotificationConnector> => {
    if(notificationConnectorId === undefined || notificationConnectorId === null || notificationConnectorId.length < 1)
        return Promise.reject("notificationConnectorId was not provided");
    return await getData(`${apiUri}/v2/NotificationConnector/${notificationConnectorId}`) as Promise<INotificationConnector>;
}

export const  DeleteNotificationConnectorWithId = async (apiUri: string, notificationConnectorId: string) : Promise<void> => {
    if(notificationConnectorId === undefined || notificationConnectorId === null || notificationConnectorId.length < 1)
        return Promise.reject("notificationConnectorId was not provided");
    return await deleteData(`${apiUri}/v2/NotificationConnector/${notificationConnectorId}`);
}

export const  CreateGotify = async (apiUri: string, gotify: IGotifyRecord) : Promise<string> => {
    if(gotify === undefined || gotify === null)
        return Promise.reject("gotify was not provided");
    return await putData(`${apiUri}/v2/NotificationConnector/Gotify`, gotify) as Promise<string>;
}

export const  CreateNtfy = async (apiUri: string, ntfy: INtfyRecord) : Promise<string> => {
    if(ntfy === undefined || ntfy === null)
        return Promise.reject("gotify was not provided");
    return await putData(`${apiUri}/v2/NotificationConnector/Ntfy`, ntfy) as Promise<string>;
}

export const  CreatePushover = async (apiUri: string, pushover: IPushoverRecord) : Promise<string> => {
    if(pushover === undefined || pushover === null)
        return Promise.reject("pushover was not provided");
    return await putData(`${apiUri}/v2/NotificationConnector/Pushover`, pushover) as Promise<string>;
}