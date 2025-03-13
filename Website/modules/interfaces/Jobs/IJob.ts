export default interface IJob{
    jobId: string;
    parentJobId: string;
    dependsOnJobIds: string[];
    jobType: JobType;
    recurrenceMs: number;
    lastExecution: Date;
    nextExecution: Date;
    state: JobState;
    enabled: boolean;
}

export enum JobType {
    DownloadSingleChapterJob = "DownloadSingleChapterJob",
    DownloadAvailableChaptersJob = "DownloadAvailableChaptersJob",
    UpdateMetaDataJob = "UpdateMetaDataJob",
    MoveFileOrFolderJob = "MoveFileOrFolderJob",
    DownloadMangaCoverJob = "DownloadMangaCoverJob",
    RetrieveChaptersJob = "RetrieveChaptersJob",
    UpdateFilesDownloadedJob = "UpdateFilesDownloadedJob"
}

export enum JobState {
    Waiting = "Waiting",
    Running = "Running",
    Completed = "Completed",
    Failed = "Failed"
}