import IMangaConnector from "./IMangaConnector";
import IProgressToken from "./IProgressToken";

export default interface IJob{
    jobType: number;
    mangaInternalId: string;
    translatedLanguage: string;
    progressToken: IProgressToken;
    recurring: boolean;
    recurrenceTime: string;
    lastExecution: Date;
    nextExecution: Date;
    id: string;
    parentJobId: string | null;
    mangaConnector: IMangaConnector;
}