import {deleteData, getData, patchData, postData, putData} from '../App';
import IJob, {JobState, JobType} from "./interfaces/Jobs/IJob";
import IModifyJobRecord from "./interfaces/records/IModifyJobRecord";

export default class Job
{
    static IntervalStringFromDate(date: Date) : string {
        let x = new Date(date);
        return `${x.getDay()}.${x.getHours()}:${x.getMinutes()}:${x.getSeconds()}`;
    }

    static async GetAllJobs(apiUri: string): Promise<IJob[]> {
        //console.info("Getting all Jobs");
        return getData(`${apiUri}/v2/Job`)
            .then((json) => {
                //console.info("Got all Jobs");
                const ret = json as IJob[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetJobsWithIds(apiUri: string, jobIds: string[]): Promise<IJob[]> {
        return postData(`${apiUri}/v2/Job/WithIDs`, jobIds)
            .then((json) => {
                //console.info("Got all Jobs");
               const ret = json as IJob[];
                //console.debug(ret);
               return (ret);
            });
    }

    static async GetJobsInState(apiUri: string, state: JobState): Promise<IJob[]> {
        if(state == null || state == undefined) {
            console.error(`state was not provided`);
            return Promise.reject();
        }
        return getData(`${apiUri}/v2/Job/State/${state}`)
            .then((json) => {
                //console.info("Got all Jobs");
                const ret = json as IJob[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetJobsWithType(apiUri: string, jobType: JobType): Promise<IJob[]> {
        if(jobType == null || jobType == undefined) {
            console.error(`jobType was not provided`);
            return Promise.reject();
        }
        return getData(`${apiUri}/v2/Job/Type/${jobType}`)
            .then((json) => {
                //console.info("Got all Jobs");
                const ret = json as IJob[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetJobsOfTypeAndWithState(apiUri: string, jobType: JobType, state: JobState): Promise<IJob[]> {
        if(jobType == null || jobType == undefined) {
            console.error(`jobType was not provided`);
            return Promise.reject();
        }
        if(state == null || state == undefined) {
            console.error(`state was not provided`);
            return Promise.reject();
        }
        return getData(`${apiUri}/v2/Job/TypeAndState/${jobType}/${state}`)
            .then((json) => {
                //console.info("Got all Jobs");
                const ret = json as IJob[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetJob(apiUri: string, jobId: string): Promise<IJob>{
        if(jobId === undefined || jobId === null || jobId.length < 1) {
            console.error(`JobId was not provided`);
            return Promise.reject();
        }
        //console.info(`Getting Job ${jobId}`);
        return getData(`${apiUri}/v2/Job/${jobId}`)
            .then((json) => {
                //console.info(`Got Job ${jobId}`);
                const ret = json as IJob;
                //console.debug(ret);
                return (ret);
            });
    }

    static DeleteJob(apiUri: string, jobId: string) : Promise<void> {
        if(jobId === undefined || jobId === null || jobId.length < 1) {
            console.error(`JobId was not provided`);
            return Promise.reject();
        }
        return deleteData(`${apiUri}/v2/Job/${jobId}`);
    }

    static async ModifyJob(apiUri: string, jobId: string, modifyData: IModifyJobRecord): Promise<IJob> {
        if(jobId === undefined || jobId === null || jobId.length < 1) {
            console.error(`JobId was not provided`);
            return Promise.reject();
        }
        if(modifyData === undefined || modifyData === null) {
            console.error(`modifyData was not provided`);
            return Promise.reject();
        }
        return patchData(`${apiUri}/v2/Job/${jobId}`, modifyData)
            .then((json) => {
                //console.info(`Got Job ${jobId}`);
                const ret = json as IJob;
                //console.debug(ret);
                return (ret);
            });
    }

    static async CreateDownloadAvailableChaptersJob(apiUri: string, mangaId: string, recurrenceMs: number): Promise<string[]> {
        if(mangaId === undefined || mangaId === null || mangaId.length < 1) {
            console.error(`mangaId was not provided`);
            return Promise.reject();
        }
        if(recurrenceMs === undefined || recurrenceMs === null || recurrenceMs < 0) {
            console.error(`recurrenceMs was not provided`);
            return Promise.reject();
        }
        return putData(`${apiUri}/v2/Job/DownloadAvailableChaptersJob/${mangaId}`, recurrenceMs)
            .then((json) => {
                //console.info(`Got Job ${jobId}`);
                const ret = json as string[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async CreateDownloadSingleChapterJob(apiUri: string, chapterId: string): Promise<string[]> {
        if(chapterId === undefined || chapterId === null || chapterId.length < 1) {
            console.error(`mangaId was not provided`);
            return Promise.reject();
        }
        return putData(`${apiUri}/v2/Job/DownloadSingleChapterJob/${chapterId}`, {})
            .then((json) => {
                //console.info(`Got Job ${jobId}`);
                const ret = json as string[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async CreateUpdateFilesJob(apiUri: string, mangaId: string): Promise<string[]> {
        if(mangaId === undefined || mangaId === null || mangaId.length < 1) {
            console.error(`mangaId was not provided`);
            return Promise.reject();
        }
        return putData(`${apiUri}/v2/Job/UpdateFilesJob/${mangaId}`, {})
            .then((json) => {
                //console.info(`Got Job ${jobId}`);
                const ret = json as string[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async CreateUpdateAllFilesJob(apiUri: string): Promise<string[]> {
        return putData(`${apiUri}/v2/Job/UpdateAllFilesJob`, {})
            .then((json) => {
                //console.info(`Got Job ${jobId}`);
                const ret = json as string[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async CreateUpdateMetadataJob(apiUri: string, mangaId: string): Promise<string[]> {
        if(mangaId === undefined || mangaId === null || mangaId.length < 1) {
            console.error(`mangaId was not provided`);
            return Promise.reject();
        }
        return putData(`${apiUri}/v2/Job/UpdateMetadataJob/${mangaId}`, {})
            .then((json) => {
                //console.info(`Got Job ${jobId}`);
                const ret = json as string[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async CreateUpdateAllMetadataJob(apiUri: string): Promise<string[]> {
        return putData(`${apiUri}/v2/Job/UpdateAllMetadataJob`, {})
            .then((json) => {
                //console.info(`Got Job ${jobId}`);
                const ret = json as string[];
                //console.debug(ret);
                return (ret);
            });
    }

    static StartJob(apiUri: string, jobId: string) : Promise<object> {
        return postData(`${apiUri}/v2/Job/${jobId}/Start`, {});
    }

    static StopJob(apiUri: string, jobId: string) : Promise<object> {
        return postData(`${apiUri}/v2/Job/${jobId}/Stop`, {});
    }
}