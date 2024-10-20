import React, {EventHandler, MouseEventHandler, ReactElement, useEffect, useState} from 'react';
import {Job} from './Job';
import '../styles/monitorMangaList.css';
import IJob from "./interfaces/IJob";
import IManga, {CoverCard} from "./interfaces/IManga";
import {Manga} from './Manga';
import '../styles/MangaCoverCard.css'
import Icon from '@mdi/react';
import { mdiTrashCanOutline, mdiPlayBoxOutline } from '@mdi/js';

export default function MonitorJobsList({onStartSearch, onJobsChanged, connectedToBackend, apiUri, updateList} : {onStartSearch() : void, onJobsChanged: EventHandler<any>, connectedToBackend: boolean, apiUri: string, updateList: Date}) {
    const [MonitoringJobs, setMonitoringJobs] = useState<IJob[]>([]);
    const [AllManga, setAllManga] = useState<IManga[]>([]);
    const [joblistUpdateInterval, setJoblistUpdateInterval] = React.useState<number>();

    useEffect(() => {
        //console.debug("Updating display list.");
        //Remove all Manga that are not associated with a Job
        setAllManga(AllManga.filter(manga => MonitoringJobs.find(job => job.mangaInternalId == manga.internalId)));
        //Fetch Manga that are missing (from Jobs)
        if(MonitoringJobs === null)
            return;
        MonitoringJobs.forEach(job => {
            if(AllManga.find(manga => manga.internalId == job.mangaInternalId))
                return;
            Manga.GetMangaById(apiUri, job.mangaInternalId != undefined ? job.mangaInternalId : job.chapter != undefined ? job.chapter.parentManga.internalId : "").
            then((manga: IManga) => setAllManga([...AllManga, manga]));
        });
    }, [MonitoringJobs]);

    useEffect(() => {
        if(connectedToBackend){
            UpdateMonitoringJobsList();
            setJoblistUpdateInterval(setInterval(() => {
                UpdateMonitoringJobsList();
            }, 1000));
        }else{
            clearInterval(joblistUpdateInterval);
            setJoblistUpdateInterval(undefined);
        }
    }, [connectedToBackend]);

    useEffect(() => {
        UpdateMonitoringJobsList();
    }, [updateList]);

    function UpdateMonitoringJobsList(){
        if(!connectedToBackend)
            return;
        //console.debug("Updating MonitoringJobsList");
        Job.GetMonitoringJobs(apiUri)
            .then((jobs) => {
                if(jobs.length > 0)
                    return Job.GetJobs(apiUri, jobs)
                return [];
            })
            .then((jobs) => setMonitoringJobs(jobs));
    }

    function StartSearchMangaEntry() : ReactElement {
        return (<div key="monitorMangaEntry.StartSearch" className="monitorMangaEntry" onClick={onStartSearch}>
            <div className="Manga" key="StartSearch.Manga">
                <img src="../media/blahaj.png" alt="Blahaj"></img>
                <div>
                    <p style={{textAlign: "center", width: "100%"}} className="Manga-name">Add new Manga</p>
                    <p style={{fontSize: "42pt", textAlign: "center"}}>+</p>
                </div>
            </div>
        </div>);
    }

    const DeleteJob : MouseEventHandler = (e) => {
        const jobId = e.currentTarget.id.slice(e.currentTarget.id.indexOf("-")+1);
        //console.info(`Pressed ${e.currentTarget.id} => ${jobId}`);
        Job.DeleteJob(apiUri, jobId).then(() => onJobsChanged(jobId));
    }

    const StartJob : MouseEventHandler = (e) => {
        const jobId = e.currentTarget.id.slice(e.currentTarget.id.indexOf("-")+1);
        //console.info(`Pressed ${e.currentTarget.id} => ${jobId}`);
        Job.StartJob(apiUri, jobId);
    }

    return (
        <div id="MonitorMangaList">
            {StartSearchMangaEntry()}
            {AllManga.map((manga: IManga) => {
                const job = MonitoringJobs.find(job => job.mangaInternalId == manga.internalId);
                if (job === undefined || job == null)
                    return <div>Error. Could not find matching job for {manga.internalId}</div>
                return <div key={"monitorMangaEntry-" + manga.internalId} className="monitorMangaEntry">
                    {CoverCard(apiUri, manga)}
                    <div className="MangaActionButtons">
                        <div id={"Delete-"+job.id} className="DeleteJobButton" onClick={DeleteJob}><Icon path={mdiTrashCanOutline} size={1.5} /></div>
                        <div id={"Start-"+job.id} className="StartJobNowButton" onClick={StartJob}><Icon path={mdiPlayBoxOutline} size={1.5} /></div>
                    </div>
                </div>;
            })}
        </div>)
}