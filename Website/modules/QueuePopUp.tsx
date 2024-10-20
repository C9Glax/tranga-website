import React, {ReactElement, useEffect} from 'react';
import IJob, {JobTypeFromNumber} from "./interfaces/IJob";
import '../styles/queuePopUp.css';
import {Job} from "./Job";
import IManga from "./interfaces/IManga";
import {Manga} from "./Manga";

export default function QueuePopUp({closeQueue} : {closeQueue(): void}){

    const [StandbyJobs, setStandbyJobs] = React.useState<IJob[]>([]);
    const [StandbyJobsManga, setStandbyJobsManga] = React.useState<IManga[]>([]);
    const [RunningJobs, setRunningJobs] = React.useState<IJob[]>([]);
    const [RunningJobsManga, setRunningJobsManga] = React.useState<IManga[]>([]);

    useEffect(() => {
        Job.GetStandbyJobs()
            .then((jobs) => {
                if(jobs.length > 0)
                    return Job.GetJobs(jobs);
                return [];
            })
            .then(setStandbyJobs)
            .finally(() => {
                console.debug("Removing Metadata Jobs");
                setStandbyJobs(StandbyJobs.filter(job => job.jobType <= 1));
            });
        Job.GetRunningJobs()
            .then((jobs) => {
                if(jobs.length > 0)
                    return Job.GetJobs(jobs);
                return [];
            })
            .then(setRunningJobs)
            .finally(() =>{
                console.debug("Removing Metadata Jobs");
                setRunningJobs(RunningJobs.filter(job => job.jobType <= 1));
            });
    }, []);

    useEffect(() => {
        if(StandbyJobs.length < 1)
            return;
        const mangaIds = StandbyJobs.filter(job => job.jobType<=2).map((job) => job.mangaInternalId != undefined ? job.mangaInternalId : job.chapter != undefined ? job.chapter.parentManga.internalId : "");
        console.debug(`Waiting mangaIds: ${mangaIds.join(",")}`);
        Manga.GetMangaByIds(mangaIds)
            .then(setStandbyJobsManga);
    }, [StandbyJobs]);

    useEffect(() => {
        if(RunningJobs.length < 1)
            return;
        console.log(RunningJobs);
        const mangaIds = RunningJobs.filter(job => job.jobType<=2).map((job) => job.mangaInternalId != undefined ? job.mangaInternalId : job.chapter != undefined ? job.chapter.parentManga.internalId : "");
        console.debug(`Running mangaIds: ${mangaIds.join(",")}`);
        Manga.GetMangaByIds(mangaIds)
            .then(setRunningJobsManga);
    }, [RunningJobs]);

    return (
        <div id="QueuePopUp">
            <div id="QueuePopUpHeader">
                <h1>Queue Status</h1>
                <img alt="Close Search" id="closeSearch" src="../media/close-x.svg" onClick={closeQueue}/>
            </div>
            <div id="QueuePopUpBody">
                <div id="RunningJobQueue">
                    <h1>Running</h1>
                    <div className="JobQueue">
                        {RunningJobs.map((job: IJob) => {
                            const manga = RunningJobsManga.find(manga => manga.internalId == job.mangaInternalId || manga.internalId == job.chapter?.parentManga.internalId);
                            if (manga === undefined || manga === null)
                                return <div key={"QueueJob-" + job.id}>Error. Could not find matching manga for {job.id}</div>
                            return <div className="QueueJob" key={"QueueJob-" + job.id}>
                                <img src={Manga.GetMangaCoverUrl(manga.internalId)} />
                                <p>{JobTypeFromNumber(job.jobType)}</p>
                            </div>;
                        })}
                    </div>
                </div>
                <div id="WaitingJobQueue">
                    <h1>Standby</h1>
                    <div className="JobQueue">
                        {StandbyJobs.map((job: IJob) => {
                            const manga = StandbyJobsManga.find(manga => manga.internalId == job.mangaInternalId || manga.internalId == job.chapter?.parentManga.internalId);
                            if (manga === undefined || manga === null)
                                return <div key={"QueueJob-" + job.id}>Error. Could not find matching manga
                                    for {job.id}</div>
                            return <div className="QueueJob" key={"QueueJob-" + job.id}>
                                <img src={Manga.GetMangaCoverUrl(manga.internalId)}/>
                                <p className="QueueJob-Name">{manga.sortName}</p>
                                <p className="QueueJob-JobType">{JobTypeFromNumber(job.jobType)}</p>
                                <p className="QueueJob-additional">{job.jobType == 0 ? `Vol.${job.chapter?.volumeNumber} Ch.${job.chapter?.chapterNumber}` : ""}</p>
                            </div>;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}