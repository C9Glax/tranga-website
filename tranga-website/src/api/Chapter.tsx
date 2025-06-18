import {getData} from "./fetchApi.tsx";
import IChapter from "./types/IChapter.ts";

export const GetChapterFromId = async (apiUri: string, chapterId: string): Promise<IChapter> => {
    if(chapterId === undefined || chapterId === null)
        return Promise.reject(`chapterId was not provided`);
    return await getData(`${apiUri}/v2/Query/Chapter/${chapterId}`) as Promise<IChapter>;
}