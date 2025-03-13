import IJob from "./IJob";

export default interface DownloadSingleChapterJob extends IJob {
    chapterId: string;
}