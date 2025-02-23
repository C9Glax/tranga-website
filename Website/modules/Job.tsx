import {deleteData, getData, postData} from '../App';
import IJob from "./interfaces/IJob";
import IProgressToken from "./interfaces/IProgressToken";

export default class Job
{
    static IntervalStringFromDate(date: Date) : string {
        let x = new Date(date);
        return `${x.getDay()}.${x.getHours()}:${x.getMinutes()}:${x.getSeconds()}`;
    }

    static async GetAllJobs(apiUri: string): Promise<string[]> {
        //console.info("Getting all Jobs");
        return getData(`${apiUri}/v2/Jobs`)
            .then((json) => {
                //console.info("Got all Jobs");
                const ret = json as string[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetRunningJobs(apiUri: string): Promise<string[]> {
        //console.info("Getting all running Jobs");
        return getData(`${apiUri}/v2/Jobs/Running`)
            .then((json) => {
                //console.info("Got all running Jobs");
                const ret = json as string[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetWaitingJobs(apiUri: string): Promise<string[]> {
        //console.info("Getting all waiting Jobs");
        return getData(`${apiUri}/v2/Jobs/Waiting`)
            .then((json) => {
                //console.info("Got all waiting Jobs");
                const ret = json as string[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetStandbyJobs(apiUri: string): Promise<string[]> {
        //console.info("Getting all standby Jobs");
        return getData(`${apiUri}/v2/Jobs/Standby`)
            .then((json) => {
                //console.info("Got all standby Jobs");
                const ret = json as string[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetMonitoringJobs(apiUri: string): Promise<string[]> {
        //console.info("Getting all monitoring Jobs");
        return getData(`${apiUri}/v2/Jobs/Monitoring`)
            .then((json) => {
                //console.info("Got all monitoring Jobs");
                const ret = json as string[];
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

    static async GetJobs(apiUri: string, jobIds: string[]): Promise<IJob[]> {
        if(jobIds === undefined || jobIds === null || jobIds.length < 1) {
            console.error(`JobIds was not provided`);
            return Promise.reject();
        }
        let reqStr = jobIds.join(",");
        //console.info(`Getting Jobs ${reqStr}`);
        return getData(`${apiUri}/v2/Job?jobIds=${reqStr}`)
            .then((json) => {
                //console.info(`Got Jobs ${reqStr}`);
                const ret = json as IJob[];
                //console.debug(ret);
                return (ret);
            });
    }

    static async GetJobProgress(apiUri: string, jobId: string): Promise<IProgressToken> {
        //console.info(`Getting Job ${jobId} Progress`);
        return getData(`${apiUri}/v2/Job/${jobId}/Progress`)
            .then((json) => {
                //console.info(`Got Job ${jobId} Progress`);
                const ret = json as IProgressToken;
                //console.debug(ret);
                return (ret);
            });
    }

    static async CreateJobDateInterval(apiUri: string, internalId: string, jobType: string, interval: Date) : Promise<null> {
        return this.CreateJob(apiUri, internalId, jobType, this.IntervalStringFromDate(interval));
    }

    static async CreateJob(apiUri: string, internalId: string, jobType: string, interval: string): Promise<null> {
        const validate = /(?:[0-9]{1,2}\.)?[0-9]{1,2}:[0-9]{1,2}(?::[0-9]{1,2})?/
        //console.info(`Creating Job for Manga ${internalId} at ${interval} interval`);
        if(!validate.test(interval)){
            console.error("Interval was in incorrect format.");
            return Promise.reject();
        }
        const data = {
            internalId: internalId,
            interval: interval
        };
        return postData(`${apiUri}/v2/Job/Create/${jobType}`, data)
            .then((json) => {
                //console.info(`Created Job for Manga ${internalId} at ${interval} interval`);
                return null;
            });
    }

    static DeleteJob(apiUri: string, jobId: string) : Promise<void> {
        return deleteData(`${apiUri}/v2/Job/${jobId}`);
    }

    static StartJob(apiUri: string, jobId: string) : Promise<object> {
        return postData(`${apiUri}/v2/Job/${jobId}/StartNow`, {});
    }

    static CancelJob(apiUri: string, jobId: string) : Promise<object> {
        return postData(`${apiUri}/v2/Job/${jobId}/Cancel`, {});
    }
}