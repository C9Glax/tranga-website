import {deleteData, getData, patchData, postData} from './fetchApi.tsx';
import IManga, {DefaultManga} from "./types/IManga.ts";
import IChapter from "./types/IChapter.ts";

export const GetAllManga = async (apiUri: string) : Promise<IManga[]> => {
    return await getData(`${apiUri}/v2/Manga`) as Promise<IManga[]>;
}

export const GetMangaWithIds = async (apiUri: string, mangaIds: string[]) : Promise<IManga[]> => {
    if(mangaIds === undefined || mangaIds === null || mangaIds.length < 1)
        return Promise.reject("mangaIds was not provided");
    return await postData(`${apiUri}/v2/Manga/WithIds`, mangaIds) as Promise<IManga[]>;
}

export const GetMangaById = async (apiUri: string, mangaId: string) : Promise<IManga> => {
    if(mangaId === undefined || mangaId === null || mangaId.length < 1)
        return Promise.reject("mangaId was not provided");
    if(mangaId === DefaultManga.mangaId)
        return Promise.reject("Default Manga was requested");
    return await getData(`${apiUri}/v2/Manga/${mangaId}`) as Promise<IManga>;
}

export const DeleteManga = async (apiUri: string, mangaId: string) : Promise<void> => {
    if(mangaId === undefined || mangaId === null || mangaId.length < 1)
        return Promise.reject("mangaId was not provided");
    if(mangaId === DefaultManga.mangaId)
        return Promise.reject("Default Manga was requested");
    return await deleteData(`${apiUri}/v2/Manga/${mangaId}`);
}

export const GetMangaCoverImageUrl = (apiUri: string, mangaId: string, ref: HTMLImageElement | undefined | null) : string => {
    if(ref == null || ref == undefined)
        return `${apiUri}/v2/Manga/${mangaId}/Cover?width=64&height=64`;
    if(mangaId === DefaultManga.mangaId)
        return "/blahaj.png";
    return `${apiUri}/v2/Manga/${mangaId}/Cover?width=${ref.clientWidth}&height=${ref.clientHeight}`;
}

export const GetChapters = async (apiUri: string, mangaId: string) : Promise<IChapter[]> => {
    if(mangaId === undefined || mangaId === null || mangaId.length < 1)
        return Promise.reject("mangaId was not provided");
    if(mangaId === DefaultManga.mangaId)
        return Promise.reject("Default Manga was requested");
    return await getData(`${apiUri}/v2/Manga/${mangaId}/Chapters`) as Promise<IChapter[]>;
}

export const  GetDownloadedChapters = async (apiUri: string, mangaId: string) : Promise<IChapter[]> => {
    if(mangaId === undefined || mangaId === null || mangaId.length < 1)
        return Promise.reject("mangaId was not provided");
    if(mangaId === DefaultManga.mangaId)
        return Promise.reject("Default Manga was requested");
    return await getData(`${apiUri}/v2/Manga/${mangaId}/Chapters/Downloaded`) as Promise<IChapter[]>;
}

export const  GetNotDownloadedChapters = async (apiUri: string, mangaId: string) : Promise<IChapter[]> => {
    if(mangaId === undefined || mangaId === null || mangaId.length < 1)
        return Promise.reject("mangaId was not provided");
    if(mangaId === DefaultManga.mangaId)
        return Promise.reject("Default Manga was requested");
    return await getData(`${apiUri}/v2/Manga/${mangaId}/Chapters/NotDownloaded`) as Promise<IChapter[]>;
}

export const  GetLatestChapterAvailable = async (apiUri: string, mangaId: string) : Promise<IChapter> => {
    if(mangaId === undefined || mangaId === null || mangaId.length < 1)
        return Promise.reject("mangaId was not provided");
    if(mangaId === DefaultManga.mangaId)
        return Promise.reject("Default Manga was requested");
    return await getData(`${apiUri}/v2/Manga/${mangaId}/Chapter/LatestAvailable`) as Promise<IChapter>;
}

export const  GetLatestChapterDownloaded = async (apiUri: string, mangaId: string) : Promise<IChapter> => {
    if(mangaId === undefined || mangaId === null || mangaId.length < 1)
        return Promise.reject("mangaId was not provided");
    if(mangaId === DefaultManga.mangaId)
        return Promise.reject("Default Manga was requested");
    return await getData(`${apiUri}/v2/Manga/${mangaId}/Chapter/LatestDownloaded`) as Promise<IChapter>;
}

export const  SetIgnoreThreshold = async (apiUri: string, mangaId: string, chapterThreshold: number) : Promise<object | undefined> => {
    if(mangaId === undefined || mangaId === null || mangaId.length < 1)
        return Promise.reject("mangaId was not provided");
    if(chapterThreshold === undefined || chapterThreshold === null)
        return Promise.reject("chapterThreshold was not provided");
    if(mangaId === DefaultManga.mangaId)
        return Promise.reject("Default Manga was requested");
    return await patchData(`${apiUri}/v2/Manga/${mangaId}/IgnoreChaptersBefore`, chapterThreshold);
}

export const MoveFolder = async (apiUri: string, mangaId: string, newPath: string) : Promise<object | undefined> => {
    if(mangaId === undefined || mangaId === null || mangaId.length < 1)
        return Promise.reject("mangaId was not provided");
    if(newPath === undefined || newPath === null || newPath.length < 1)
        return Promise.reject("newPath was not provided");
    if(mangaId === DefaultManga.mangaId)
        return Promise.reject("Default Manga was requested");
    return await postData(`${apiUri}/v2/Manga/{MangaId}/MoveFolder`, {newPath});
}