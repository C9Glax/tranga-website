import IManga from './interfaces/IManga';
import {deleteData, getData, patchData, postData} from '../App';
import IChapter from "./interfaces/IChapter";

export default class MangaFunctions
{
    static async GetAllManga(apiUri: string): Promise<IManga[]> {
        //console.info("Getting all MangaFunctions");
        return getData(`${apiUri}/v2/Manga`)
            .then((json) => {
                //console.info("Got all MangaFunctions");
                const ret = json as IManga[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetMangaWithIds(apiUri: string, mangaIds: string[]): Promise<IManga[]> {
        if(mangaIds === undefined || mangaIds === null || mangaIds.length < 1) {
            console.error(`mangaIds was not provided`);
            return Promise.reject();
        }
        //console.debug(`Getting Mangas ${internalIds.join(",")}`);
        return await postData(`${apiUri}/v2/Manga/WithIds`, mangaIds)
            .then((json) => {
                //console.debug(`Got MangaFunctions ${internalIds.join(",")}`);
                const ret = json as IManga[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetMangaById(apiUri: string, mangaId: string): Promise<IManga> {
        if(mangaId === undefined || mangaId === null || mangaId.length < 1) {
            console.error(`mangaId was not provided`);
            return Promise.reject();
        }
        //console.info(`Getting MangaFunctions ${internalId}`);
        return await getData(`${apiUri}/v2/Manga/${mangaId}`)
            .then((json) => {
                //console.info(`Got MangaFunctions ${internalId}`);
                const ret = json as IManga;
                //console.debug(ret);
                return (ret);
            });
    }

    static async DeleteManga(apiUri: string, mangaId: string): Promise<void> {
        if(mangaId === undefined || mangaId === null || mangaId.length < 1) {
            console.error(`mangaId was not provided`);
            return Promise.reject();
        }
        return deleteData(`${apiUri}/v2/Manga/${mangaId}`);
    }

    static GetMangaCoverImageUrl(apiUri: string, mangaId: string, ref: HTMLImageElement | undefined): string {
        //console.debug(`Getting MangaFunctions Cover-Url ${internalId}`);
        if(ref == null || ref == undefined)
            return `${apiUri}/v2/Manga/${mangaId}/Cover?width=64&height=64`;
        return `${apiUri}/v2/Manga/${mangaId}/Cover?width=${ref.clientWidth}&height=${ref.clientHeight}`;
    }

    static async GetChapters(apiUri: string, mangaId: string): Promise<IChapter[]> {
        if(mangaId === undefined || mangaId === null || mangaId.length < 1) {
            console.error(`mangaId was not provided`);
            return Promise.reject();
        }
        return getData(`${apiUri}/v2/Manga/${mangaId}/Chapters`)
            .then((json) => {
                //console.info(`Got MangaFunctions ${internalId}`);
                const ret = json as IChapter[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetDownloadedChapters(apiUri: string, mangaId: string): Promise<IChapter[]> {
        if(mangaId === undefined || mangaId === null || mangaId.length < 1) {
            console.error(`mangaId was not provided`);
            return Promise.reject();
        }
        return getData(`${apiUri}/v2/Manga/${mangaId}/Chapters/Downloaded`)
            .then((json) => {
                //console.info(`Got MangaFunctions ${internalId}`);
                const ret = json as IChapter[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetNotDownloadedChapters(apiUri: string, mangaId: string): Promise<IChapter[]> {
        if(mangaId === undefined || mangaId === null || mangaId.length < 1) {
            console.error(`mangaId was not provided`);
            return Promise.reject();
        }
        return getData(`${apiUri}/v2/Manga/${mangaId}/Chapters/NotDownloaded`)
            .then((json) => {
                //console.info(`Got MangaFunctions ${internalId}`);
                const ret = json as IChapter[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetLatestChapterAvailable(apiUri: string, mangaId: string): Promise<IChapter> {
        if(mangaId === undefined || mangaId === null || mangaId.length < 1) {
            console.error(`mangaId was not provided`);
            return Promise.reject();
        }
        return getData(`${apiUri}/v2/Manga/${mangaId}/Chapter/LatestAvailable`)
            .then((json) => {
                //console.info(`Got MangaFunctions ${internalId}`);
                const ret = json as IChapter;
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetLatestChapterDownloaded(apiUri: string, mangaId: string): Promise<IChapter> {
        if(mangaId === undefined || mangaId === null || mangaId.length < 1) {
            console.error(`mangaId was not provided`);
            return Promise.reject();
        }
        return getData(`${apiUri}/v2/Manga/${mangaId}/Chapter/LatestDownloaded`)
            .then((json) => {
                //console.info(`Got MangaFunctions ${internalId}`);
                const ret = json as IChapter;
                //console.debug(ret);
                return (ret);
            });
    }

    static async SetIgnoreThreshold(apiUri: string, mangaId: string, chapterThreshold: number): Promise<object> {
        if(mangaId === undefined || mangaId === null || mangaId.length < 1) {
            console.error(`mangaId was not provided`);
            return Promise.reject();
        }
        if(chapterThreshold === undefined || chapterThreshold === null) {
            console.error(`chapterThreshold was not provided`);
            return Promise.reject();
        }
        return patchData(`${apiUri}/v2/Manga/${mangaId}/IgnoreChaptersBefore`, {chapterThreshold});
    }

    static async MoveFolder(apiUri: string, mangaId: string, newPath: string): Promise<object> {
        if(mangaId === undefined || mangaId === null || mangaId.length < 1) {
            console.error(`mangaId was not provided`);
            return Promise.reject();
        }
        if(newPath === undefined || newPath === null || newPath.length < 1) {
            console.error(`newPath was not provided`);
            return Promise.reject();
        }
        return postData(`${apiUri}/v2/Manga/{MangaId}/MoveFolder`, {newPath});
    }
}