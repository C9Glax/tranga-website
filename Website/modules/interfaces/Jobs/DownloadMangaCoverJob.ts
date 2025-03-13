import IJob from "./IJob";

export default interface DownloadMangaCoverJob extends IJob {
    mangaId: string;
}