import IJob from "./IJob";

export default interface DownloadAvailableChaptersJob extends IJob {
    mangaId: string;
}