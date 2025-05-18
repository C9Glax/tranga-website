import IJob from "./IJob.ts";

export default interface IJobWithChapterId extends IJob {
    chapterId: string;
}