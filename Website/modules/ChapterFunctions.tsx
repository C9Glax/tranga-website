import {getData} from "../App";
import IChapter from "./interfaces/IChapter";

export default class ChapterFunctions {

    static async GetChapterFromId(apiUri: string, chapterId: string): Promise<IChapter> {
        if(chapterId === undefined || chapterId === null) {
            console.error(`chapterId was not provided`);
            return Promise.reject();
        }
        return getData(`${apiUri}/v2/Query/Chapter/${chapterId}`)
            .then((json) => {
                //console.info("Got all MangaFunctions");
                const ret = json as IChapter;
                //console.debug(ret);
                return (ret);
            });
    }
}