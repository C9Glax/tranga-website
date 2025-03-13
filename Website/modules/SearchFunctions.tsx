import IManga from "./interfaces/IManga";
import {getData, postData} from "../App";

export default class SearchFunctions {

    static async SearchName(apiUri: string, name: string) : Promise<IManga[]> {
        if(name === undefined || name === null || name.length < 1) {
            console.error(`name was not provided`);
            return Promise.reject();
        }
        return postData(`${apiUri}/v2/Search/Name`, name)
            .then((json) => {
                const ret = json as IManga[];
                return (ret);
            });
    }

    static async SearchNameOnConnector(apiUri: string, connectorName: string, name: string) : Promise<IManga[]> {
        if(connectorName === undefined || connectorName === null || connectorName.length < 1) {
            console.error(`connectorName was not provided`);
            return Promise.reject();
        }
        if(name === undefined || name === null || name.length < 1) {
            console.error(`name was not provided`);
            return Promise.reject();
        }
        return postData(`${apiUri}/v2/Search/${connectorName}`, name)
            .then((json) => {
                const ret = json as IManga[];
                return (ret);
            });
    }

    static async SearchUrl(apiUri: string, url: string) : Promise<IManga> {
        if(url === undefined || url === null || url.length < 1) {
            console.error(`name was not provided`);
            return Promise.reject();
        }
        return postData(`${apiUri}/v2/Search/Url`, url)
            .then((json) => {
                const ret = json as IManga;
                return (ret);
            });
    }

}