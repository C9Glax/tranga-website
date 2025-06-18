import IJob from "./IJob.ts";

export default interface IJobWithMangaId extends IJob {
    mangaId: string;
}