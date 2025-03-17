import INotificationConnector from "./interfaces/INotificationConnector";
import {deleteData, getData, putData} from "../App";
import IGotifyRecord from "./interfaces/records/IGotifyRecord";
import INtfyRecord from "./interfaces/records/INtfyRecord";
import ILunaseaRecord from "./interfaces/records/ILunaseaRecord";

export default class NotificationConnectorFunctions {

    static async GetNotificationConnectors(apiUri: string) : Promise<INotificationConnector[]> {
        //console.info("Getting Notification Connectors");
        return getData(`${apiUri}/v2/NotificationConnector`)
            .then((json) => {
                //console.info("Got Notification Connectors");
                const ret = json as INotificationConnector[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async CreateNotificationConnector(apiUri: string, newConnector: INotificationConnector): Promise<string> {
        return putData(`${apiUri}/v2/NotificationConnector`, newConnector)
            .then((json) => {
                //console.info("Got Notification Connectors");
                const ret = json as unknown as string;
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetNotificationConnectorWithId(apiUri: string, notificationConnectorId: string) : Promise<INotificationConnector> {
        if(notificationConnectorId === undefined || notificationConnectorId === null || notificationConnectorId.length < 1) {
            console.error(`notificationConnectorId was not provided`);
            return Promise.reject();
        }
        //console.info("Getting Notification Connectors");
        return getData(`${apiUri}/v2/NotificationConnector/${notificationConnectorId}`)
            .then((json) => {
                //console.info("Got Notification Connectors");
                const ret = json as INotificationConnector;
                //console.debug(ret);
                return (ret);
            });
    }

    static async DeleteNotificationConnectorWithId(apiUri: string, notificationConnectorId: string) : Promise<void> {
        if(notificationConnectorId === undefined || notificationConnectorId === null || notificationConnectorId.length < 1) {
            console.error(`notificationConnectorId was not provided`);
            return Promise.reject();
        }
        //console.info("Getting Notification Connectors");
        return deleteData(`${apiUri}/v2/NotificationConnector/${notificationConnectorId}`);
    }

    static async CreateGotify(apiUri: string, gotify: IGotifyRecord) : Promise<string> {
        if(gotify === undefined || gotify === null) {
            console.error(`gotify was not provided`);
            return Promise.reject();
        }
        //console.info("Getting Notification Connectors");
        return putData(`${apiUri}/v2/NotificationConnector/Gotify`, gotify)
            .then((json) => {
                //console.info("Got Notification Connectors");
                const ret = json as unknown as string;
                //console.debug(ret);
                return (ret);
            });
    }

    static async CreateNtfy(apiUri: string, ntfy: INtfyRecord) : Promise<string> {
        if(ntfy === undefined || ntfy === null) {
            console.error(`ntfy was not provided`);
            return Promise.reject();
        }
        //console.info("Getting Notification Connectors");
        return putData(`${apiUri}/v2/NotificationConnector/Ntfy`, ntfy)
            .then((json) => {
                //console.info("Got Notification Connectors");
                const ret = json as unknown as string;
                //console.debug(ret);
                return (ret);
            });
    }

    static async CreateLunasea(apiUri: string, lunasea: ILunaseaRecord) : Promise<string> {
        if(lunasea === undefined || lunasea === null) {
            console.error(`ntfy was not provided`);
            return Promise.reject();
        }
        //console.info("Getting Notification Connectors");
        return putData(`${apiUri}/v2/NotificationConnector/Lunasea`, lunasea)
            .then((json) => {
                //console.info("Got Notification Connectors");
                const ret = json as unknown as string;
                //console.debug(ret);
                return (ret);
            });
    }
}