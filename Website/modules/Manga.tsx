import IManga from './interfaces/IManga';
import { getData } from '../App';

export default class Manga
{
    static async GetAllManga(apiUri: string): Promise<IManga[]> {
        //console.info("Getting all Manga");
        return getData(`${apiUri}/v2/Mangas`)
            .then((json) => {
                //console.info("Got all Manga");
                const ret = json as IManga[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async SearchManga(apiUri: string, name: string): Promise<IManga[]> {
        //console.info(`Getting Manga ${name} from all Connectors`);
        return await getData(`${apiUri}/v2/Manga/Search?title=${name}`)
            .then((json) => {
                //console.info(`Got Manga ${name}`);
                const ret = json as IManga[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetMangaById(apiUri: string, internalId: string): Promise<IManga> {
        //console.info(`Getting Manga ${internalId}`);
        return await getData(`${apiUri}/v2/Manga/${internalId}`)
            .then((json) => {
                //console.info(`Got Manga ${internalId}`);
                const ret = json as IManga;
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetMangaByIds(apiUri: string, internalIds: string[]): Promise<IManga[]> {
        //console.debug(`Getting Mangas ${internalIds.join(",")}`);
        return await getData(`${apiUri}/v2/Manga?mangaIds=${internalIds.join(",")}`)
            .then((json) => {
                //console.debug(`Got Manga ${internalIds.join(",")}`);
                const ret = json as IManga[];
                //console.debug(ret);
                return (ret);
            });
    }

    static GetMangaCoverUrl(apiUri: string, internalId: string): string {
        //console.debug(`Getting Manga Cover-Url ${internalId}`);
        return `${apiUri}/v2/Manga/${internalId}/Cover`;
    }
}