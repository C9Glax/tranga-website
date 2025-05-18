export default interface IJob{
    jobId: string;
    parentJobId: string | null;
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
    UpdateChaptersDownloadedJob = "UpdateChaptersDownloadedJob",
    MoveMangaLibraryJob = "MoveMangaLibraryJob",
    UpdateSingleChapterDownloadedJob = "UpdateSingleChapterDownloadedJob",
    UpdateCoverJob = "UpdateCoverJob"
}

export enum JobState {
    FirstExecution = "FirstExecution",
    Running = "Running",
    Completed = "Completed",
    CompletedWaiting = "CompletedWaiting",
    Failed = "Failed"
}