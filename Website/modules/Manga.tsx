import IManga from './interfaces/IManga';
import { getData } from '../App';

export class Manga
{
    static async GetAllManga(): Promise<IManga[]> {
        console.debug("Getting all Manga");
        return getData("http://127.0.0.1:6531/v2/Mangas")
            .then((json) => {
                console.debug("Got all Manga");
                return (json as IManga[]);
            });
    }

    static async SearchManga(name: string): Promise<IManga[]> {
        console.debug(`Getting Manga ${name} from all Connectors`);
        return await getData(`http://127.0.0.1:6531/v2/Manga/Search?title=${name}`)
            .then((json) => {
                console.debug(`Got Manga ${name}`);
                return (json as IManga[]);
            });
    }

    static async GetMangaById(internalId: string): Promise<IManga> {
        console.debug(`Getting Manga ${internalId}`);
        return await getData(`http://127.0.0.1:6531/v2/Manga/${internalId}`)
            .then((json) => {
                console.debug(`Got Manga ${internalId}`);
                return (json as IManga);
            });
    }

    static async GetMangaByIds(internalIds: string[]): Promise<IManga[]> {
        console.debug(`Getting Mangas ${internalIds.join(",")}`);
        return await getData(`http://127.0.0.1:6531/v2/Manga?internalIds=${internalIds.join(",")}`)
            .then((json) => {
                console.debug(`Got Manga ${internalIds.join(",")}`);
                return (json as IManga[]);
            });
    }

    static GetMangaCoverUrl(internalId: string): string {
        console.debug(`Getting Manga Cover-Url ${internalId}`);
        return `http://127.0.0.1:6531/v2/Manga/${internalId}/Cover`;
    }
}