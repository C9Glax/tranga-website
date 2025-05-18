import {deleteData, getData, patchData, postData, putData} from "./fetchApi";
import IJob, {JobState, JobType} from "./types/Jobs/IJob";
import IModifyJobRecord from "./types/records/IModifyJobRecord";
import IDownloadAvailableChaptersJobRecord from "./types/records/IDownloadAvailableChaptersJobRecord.ts";

export const GetAllJobs = async (apiUri: string) : Promise<IJob[]> => {
    return await getData(`${apiUri}/v2/Job`) as Promise<IJob[]>;
}

export const GetJobsWithIds = async (apiUri: string, jobIds: string[]) : Promise<IJob[]> => {
    if(jobIds === null || jobIds === undefined || jobIds.length === 0)
        return Promise.reject("jobIds was not provided");
    return await postData(`${apiUri}/v2/Job/WithIDs`, jobIds) as Promise<IJob[]>;
}

export const GetJobsInState = async (apiUri: string, state: JobState) : Promise<IJob[]> => {
    if(state == null || state == undefined)
        return Promise.reject("state was not provided");
    return await getData(`${apiUri}/v2/Job/State/${state}`) as Promise<IJob[]>;
}

export const GetJobsWithType = async (apiUri: string, jobType: JobType) : Promise<IJob[]> => {
    if(jobType == null || jobType == undefined) {
        return Promise.reject("jobType was not provided");
    }
    return await getData(`${apiUri}/v2/Job/Type/${jobType}`) as Promise<IJob[]>;
}

export const GetJobsOfTypeAndWithState = async (apiUri: string, jobType: JobType, state: JobState) : Promise<IJob[]> => {
    if(jobType == null || jobType == undefined)
        return Promise.reject("jobType was not provided");
    if(state == null || state == undefined)
        return Promise.reject("state was not provided");
    return await getData(`${apiUri}/v2/Job/TypeAndState/${jobType}/${state}`) as Promise<IJob[]>;
}

export const GetJob = async (apiUri: string, jobId: string) : Promise<IJob> => {
    if(jobId === undefined || jobId === null || jobId.length < 1)
        return Promise.reject("jobId was not provided");
    return await getData(`${apiUri}/v2/Job/${jobId}`) as Promise<IJob>;
}

export const DeleteJob = async (apiUri: string, jobId: string) : Promise<void> => {
    if(jobId === undefined || jobId === null || jobId.length < 1)
        return Promise.reject("jobId was not provided");
    return await deleteData(`${apiUri}/v2/Job/${jobId}`);
}

export const ModifyJob = async (apiUri: string, jobId: string, modifyData: IModifyJobRecord) : Promise<IJob> => {
    if(jobId === undefined || jobId === null || jobId.length < 1)
        return Promise.reject("jobId was not provided");
    if(modifyData === undefined || modifyData === null)
        return Promise.reject("modifyData was not provided");
    return await patchData(`${apiUri}/v2/Job/${jobId}`, modifyData) as Promise<IJob>;
}

export const CreateDownloadAvailableChaptersJob = async (apiUri: string, mangaId: string, data: IDownloadAvailableChaptersJobRecord) : Promise<string[]> => {
    if(mangaId === undefined || mangaId === null || mangaId.length < 1)
        return Promise.reject("mangaId was not provided");
    if(data === undefined || data === null)
        return Promise.reject("data was not provided");
    return await putData(`${apiUri}/v2/Job/DownloadAvailableChaptersJob/${mangaId}`, data) as Promise<string[]>;
}

export const CreateDownloadSingleChapterJob = async (apiUri: string, chapterId: string) : Promise<string[]> => {
    if(chapterId === undefined || chapterId === null || chapterId.length < 1)
        return Promise.reject("chapterId was not provided");
    return await putData(`${apiUri}/v2/Job/DownloadSingleChapterJob/${chapterId}`, {}) as Promise<string[]>;
}

export const CreateUpdateFilesJob = async (apiUri: string, mangaId: string) : Promise<string[]> => {
    if(mangaId === undefined || mangaId === null || mangaId.length < 1)
        return Promise.reject("mangaId was not provided");
    return await putData(`${apiUri}/v2/Job/UpdateFilesJob/${mangaId}`, {}) as Promise<string[]>;
}

export const CreateUpdateAllFilesJob = async (apiUri: string) : Promise<string[]> => {
    return await putData(`${apiUri}/v2/Job/UpdateAllFilesJob`, {}) as Promise<string[]>;
}

export const CreateUpdateMetadataJob = async (apiUri: string, mangaId: string) : Promise<string[]> => {
    if(mangaId === undefined || mangaId === null || mangaId.length < 1)
        return Promise.reject("mangaId was not provided");
    return await putData(`${apiUri}/v2/Job/UpdateMetadataJob/${mangaId}`, {}) as Promise<string[]>;
}

export const CreateUpdateAllMetadataJob = async (apiUri: string) : Promise<string[]> => {
    return await putData(`${apiUri}/v2/Job/UpdateAllMetadataJob`, {}) as Promise<string[]>;
}

export const StartJob = async (apiUri: string, jobId: string) : Promise<object | undefined> => {
    return await postData(`${apiUri}/v2/Job/${jobId}/Start`, {});
}

export const StopJob = async (apiUri: string, jobId: string) : Promise<object | undefined> => {
    return await postData(`${apiUri}/v2/Job/${jobId}/Stop`, {});
}