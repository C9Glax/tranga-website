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
    DownloadMangaCoverJob = "DownloadMangaCoverJob",
    RetrieveChaptersJob = "RetrieveChaptersJob",
    UpdateChaptersDownloadedJob = "UpdateChaptersDownloadedJob",
    MoveMangaLibraryJob = "MoveMangaLibraryJob",
    UpdateCoverJob = "UpdateCoverJob"
}

export function JobTypeToString(job: JobType | string): string {
    return job.replace(/([A-Z])/g, ' $1').replace("Job", "").trim();
}

export enum JobState {
    FirstExecution = "FirstExecution",
    Running = "Running",
    Completed = "Completed",
    CompletedWaiting = "CompletedWaiting",
    Failed = "Failed"
}

export function JobStateToString(state: JobState | string): string {
    return state.replace(/([A-Z])/g, ' $1').trim();
}