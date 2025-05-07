import IJob from "./IJob";

export default interface IDownloadMangaCoverJob extends IJob {
    mangaId: string;
}