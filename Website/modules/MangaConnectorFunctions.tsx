import IMangaConnector from './interfaces/IMangaConnector';
import {getData, patchData} from '../App';

export class MangaConnectorFunctions
{
    static async GetAllConnectors(apiUri: string): Promise<IMangaConnector[]> {
        //console.info("Getting all MangaConnectors");
        return getData(`${apiUri}/v2/MangaConnector`)
            .then((json) => {
                //console.info("Got all MangaConnectors");
                return (json as IMangaConnector[]);
            });
    }

    static async GetEnabledConnectors(apiUri: string): Promise<IMangaConnector[]> {
        //console.info("Getting all enabled MangaConnectors");
        return getData(`${apiUri}/v2/MangaConnector/enabled`)
            .then((json) => {
                //console.info("Got all enabled MangaConnectors");
                return (json as IMangaConnector[]);
            });
    }

    static async GetDisabledConnectors(apiUri: string): Promise<IMangaConnector[]> {
        //console.info("Getting all disabled MangaConnectors");
        return getData(`${apiUri}/v2/MangaConnector/disabled`)
            .then((json) => {
                //console.info("Got all disabled MangaConnectors");
                return (json as IMangaConnector[]);
            });
    }

    static async SetConnectorEnabled(apiUri: string, connectorName: string, enabled: boolean): Promise<object> {
        if(connectorName === undefined || connectorName === null || connectorName.length < 1) {
            console.error(`connectorName was not provided`);
            return Promise.reject();
        }
        if(enabled === undefined || enabled === null) {
            console.error(`enabled was not provided`);
            return Promise.reject();
        }
        return patchData(`${apiUri}/v2/MangaConnector/${connectorName}/SetEnabled/${enabled}`, {});
    }
}