import IJob from "./IJob";

export default interface IDownloadAvailableChaptersJob extends IJob {
    mangaId: string;
}