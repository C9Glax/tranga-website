import IJob from "./IJob";

export default interface IDownloadSingleChapterJob extends IJob {
    chapterId: string;
}