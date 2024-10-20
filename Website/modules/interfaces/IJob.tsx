import IMangaConnector from "./IMangaConnector";
import IProgressToken from "./IProgressToken";
import IChapter from "./IChapter";

export default interface IJob{
    progressToken: IProgressToken;
    recurring: boolean;
    recurrenceTime: string;
    lastExecution: Date;
    nextExecution: Date;
    id: string;
    jobType: number;
    parentJobId: string | null;
    mangaConnector: IMangaConnector;
    mangaInternalId: string | undefined; //only on DownloadNewChapters
    translatedLanguage: string | undefined; //only on DownloadNewChapters
    chapter: IChapter | undefined; //only on DownloadChapter
}

export function JobTypeFromNumber(n: number): string {
    switch(n) {
        case 0: return "Download Chapter";
        case 1: return "Download New Chapters";
        case 2: return "Update Metadata";
        case 3: return "Monitor";
    }
    return "";
}