import React, {useEffect, useState} from 'react';
import IJob from "./interfaces/IJob";
import '../styles/queuePopUp.css';
import '../styles/popup.css';
import Job from "./Job";
import IManga, {QueueItem} from "./interfaces/IManga";
import Manga from "./Manga";

export default function QueuePopUp({connectedToBackend, children, apiUri} : {connectedToBackend: boolean, children: JSX.Element[], apiUri: string}) {

    const [StandbyJobs, setStandbyJobs] = React.useState<IJob[]>([]);
    const [StandbyJobsManga, setStandbyJobsManga] = React.useState<IManga[]>([]);
    const [RunningJobs, setRunningJobs] = React.useState<IJob[]>([]);
    const [RunningJobsManga, setRunningJobsManga] = React.useState<IManga[]>([]);
    const [showQueuePopup, setShowQueuePopup] = useState<boolean>(false);
    const [queueListInterval, setQueueListInterval] = React.useState<number>();

    useEffect(() => {
        if(!showQueuePopup)
            return;
        UpdateMonitoringJobsList();
    }, [showQueuePopup]);

    useEffect(() => {
        if(connectedToBackend){
            UpdateMonitoringJobsList();
            setQueueListInterval(setInterval(() => {
                UpdateMonitoringJobsList();
            }, 2000));
        }else{
            clearInterval(queueListInterval);
            setQueueListInterval(undefined);
        }
    }, [connectedToBackend]);

    function UpdateMonitoringJobsList(){
        Job.GetStandbyJobs(apiUri)
            .then((jobs:string[]) => {
                if(jobs.length > 0)
                    return Job.GetJobs(apiUri, jobs);
                return [];
            })
            .then((jobs:IJob[]) => {
                //console.debug("Removing Metadata Jobs");
                //console.log(StandbyJobs)
                setStandbyJobs(jobs.filter(job => job.jobType <= 2));
                //console.log(StandbyJobs)
            });
        Job.GetRunningJobs(apiUri)
            .then((jobs:string[]) => {
                if(jobs.length > 0)
                    return Job.GetJobs(apiUri, jobs);
                return [];
            })
            .then((jobs:IJob[]) =>{
                //console.debug("Removing Metadata Jobs");
                setRunningJobs(jobs.filter(job => job.jobType <= 2));
            });
    }

    useEffect(() => {
        if(StandbyJobs.length < 1)
            return;
        const mangaIds = StandbyJobs.filter(job => job.jobType<=2).map((job) => job.mangaInternalId != undefined ? job.mangaInternalId : job.chapter != undefined ? job.chapter.parentManga.internalId : "");
        //console.debug(`Waiting mangaIds: ${mangaIds.join(",")}`);
        Manga.GetMangaByIds(apiUri, mangaIds)
            .then(setStandbyJobsManga);
    }, [StandbyJobs]);

    useEffect(() => {
        if(RunningJobs.length < 1)
            return;
        //console.log(RunningJobs);
        const mangaIds = RunningJobs.filter(job => job.jobType<=2).map((job) => job.mangaInternalId != undefined ? job.mangaInternalId : job.chapter != undefined ? job.chapter.parentManga.internalId : "");
        //console.debug(`Running mangaIds: ${mangaIds.join(",")}`);
        Manga.GetMangaByIds(apiUri, mangaIds)
            .then(setRunningJobsManga);
    }, [RunningJobs]);

    return (<>
            <div onClick={() => setShowQueuePopup(true)}>
                {children}
            </div>
            {showQueuePopup
                ? <div className="popup" id="QueuePopUp">
                    <div className="popupHeader">
                        <h1>Queue Status</h1>
                        <img alt="Close Search" className="close" src="../media/close-x.svg"
                             onClick={() => setShowQueuePopup(false)}/>
                    </div>
                    <div id="QueuePopUpBody" className="popupBody">
                        <div id="RunningJobQueue">
                            <h1>Running</h1>
                            <div className="JobQueue">
                                {RunningJobs.map((job: IJob) => {
                                    const manga = RunningJobsManga.find(manga => manga.internalId == job.mangaInternalId || manga.internalId == job.chapter?.parentManga.internalId);
                                    if (manga === undefined || manga === null)
                                        return <div key={"QueueJob-" + job.id}>Error. Could not find matching manga for {job.id}</div>
                                    return QueueItem(apiUri, manga, job, UpdateMonitoringJobsList);
                                })}
                            </div>
                        </div>
                        <div id="WaitingJobQueue">
                            <h1>Standby</h1>
                            <div className="JobQueue">
                                {StandbyJobs.map((job: IJob) => {
                                    const manga = StandbyJobsManga.find(manga => manga.internalId == job.mangaInternalId || manga.internalId == job.chapter?.parentManga.internalId);
                                    if (manga === undefined || manga === null)
                                        return <div key={"QueueJob-" + job.id}>Error. Could not find matching manga for {job.id}</div>
                                    return QueueItem(apiUri, manga, job, UpdateMonitoringJobsList);
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                : <></>
            }
        </>
    );
}