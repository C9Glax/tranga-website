import {deleteData, getData, postData} from '../App';
import IJob from "./interfaces/IJob";
import IProgressToken from "./interfaces/IProgressToken";

export class Job
{
    static async GetAllJobs(): Promise<string[]> {
        console.debug("Getting all Jobs");
        return getData("http://127.0.0.1:6531/v2/Jobs")
            .then((json) => {
                console.debug("Got all Jobs");
                return (json as string[]);
            });
    }

    static async GetRunningJobs(): Promise<string[]> {
        console.debug("Getting all running Jobs");
        return getData("http://127.0.0.1:6531/v2/Jobs/Running")
            .then((json) => {
                console.debug("Got all running Jobs");
                return (json as string[]);
            });
    }

    static async GetWaitingJobs(): Promise<string[]> {
        console.debug("Getting all waiting Jobs");
        return getData("http://127.0.0.1:6531/v2/Jobs/Waiting")
            .then((json) => {
                console.debug("Got all waiting Jobs");
                return (json as string[]);
            });
    }

    static async GetMonitoringJobs(): Promise<string[]> {
        console.debug("Getting all monitoring Jobs");
        return getData("http://127.0.0.1:6531/v2/Jobs/Monitoring")
            .then((json) => {
                console.debug("Got all monitoring Jobs");
                return (json as string[]);
            });
    }

    static async GetJob(jobId: string): Promise<IJob>{
        if(jobId === undefined || jobId === null || jobId.length < 1) {
            console.error(`JobId was not provided`);
            return Promise.reject();
        }
        console.debug(`Getting Job ${jobId}`);
        return getData(`http://127.0.0.1:6531/v2/Job/${jobId}`)
            .then((json) => {
                console.debug(`Got Job ${jobId}`);
                return (json as IJob);
            });
    }

    static async GetJobs(jobIds: string[]): Promise<IJob[]> {
        if(jobIds === undefined || jobIds === null || jobIds.length < 1) {
            console.error(`JobIds was not provided`);
            return Promise.reject();
        }
        let reqStr = jobIds.join(",");
        console.debug(`Getting Jobs ${reqStr}`);
        return getData(`http://127.0.0.1:6531/v2/Job?jobIds=${reqStr}`)
            .then((json) => {
                console.debug(`Got Jobs ${reqStr}`);
                return (json as IJob[]);
            });
    }

    static async GetJobProgress(jobId: string): Promise<IProgressToken> {
        console.debug(`Getting Job ${jobId} Progress`);
        return getData(`http://127.0.0.1:6531/v2/Job/${jobId}/Progress`)
            .then((json) => {
                console.debug(`Got Job ${jobId} Progress`);
                return (json as IProgressToken);
            });
    }

    static async CreateJob(internalId: string, jobType: string, interval: string): Promise<IJob> {
        console.debug(`Creating Job for Manga ${internalId} at ${interval} interval`);
        let data = {
            internalId: internalId,
            interval: interval
        };
        return postData(`http://127.0.0.1:6531/v2/Job/Create/${jobType}`, data)
            .then((json) => {
                console.debug(`Created Job for Manga ${internalId} at ${interval} interval`);
                return (json as IJob);
            });
    }

    static DeleteJob(jobId: string) {
        deleteData(`http://127.0.0.1:6531/v2/Job/${jobId}`);
    }

    static StartJob(jobId: string) {
        postData(`http://127.0.0.1:6531/v2/Job/${jobId}/StartNow`, {});
    }

    static CancelJob(jobId: string) {
        postData(`http://127.0.0.1:6531/v2/Job/${jobId}/Cancel`, {});
    }
}