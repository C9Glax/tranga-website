import IMangaConnector from './interfaces/IMangaConnector';
import IManga from './interfaces/IManga';
import { getData } from '../App';

export class MangaConnector
{
    static async GetAllConnectors(): Promise<IMangaConnector[]> {
        console.debug("Getting all MangaConnectors");
        return getData("http://127.0.0.1:6531/v2/Connector/Types")
            .then((json) => {
                console.debug("Got all MangaConnectors");
                return (json as IMangaConnector[]);
            });
    }

    static async GetMangaFromConnectorByTitle(connector: IMangaConnector, name: string): Promise<IManga[]> {
        console.debug(`Getting Manga ${name}`);
        return await getData(`http://127.0.0.1:6531/v2/Connector/${connector.name}/GetManga?title=${name}`)
            .then((json) => {
                console.debug(`Got Manga ${name}`);
                return (json as IManga[]);
            });
    }

    static async GetMangaFromConnectorByUrl(connector: IMangaConnector, url: string): Promise<IManga> {
        console.debug(`Getting Manga ${url}`);
        return await getData(`http://127.0.0.1:6531/v2/Connector/${connector.name}/GetManga?url=${url}`)
            .then((json) => {
                console.debug(`Got Manga ${url}`);
                return (json as IManga);
            });
    }
}