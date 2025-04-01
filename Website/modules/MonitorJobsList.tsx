import React, {ReactElement, useEffect, useState} from 'react';
import Job from './api/Job';
import '../styles/monitorMangaList.css';
import {JobType} from "./types/Jobs/IJob";
import '../styles/mangaCover.css'
import IDownloadAvailableChaptersJob from "./types/Jobs/IDownloadAvailableChaptersJob";
import Manga from "./api/Manga";
import MangaItem from "./Elements/Manga";

export default function MonitorJobsList({onStartSearch, connectedToBackend, apiUri, checkConnectedInterval} : {onStartSearch() : void, connectedToBackend: boolean, apiUri: string, checkConnectedInterval: number}) {
    const [MonitoringJobs, setMonitoringJobs] = useState<IDownloadAvailableChaptersJob[]>([]);
    const [joblistUpdateInterval, setJoblistUpdateInterval] = React.useState<number | undefined>(undefined);

    useEffect(() => {
        if(connectedToBackend) {
            UpdateMonitoringJobsList();
            if(joblistUpdateInterval === undefined){
                setJoblistUpdateInterval(setInterval(() => {
                    UpdateMonitoringJobsList();
                }, checkConnectedInterval));
            }
        }else{
            clearInterval(joblistUpdateInterval);
            setJoblistUpdateInterval(undefined);
        }
    }, [connectedToBackend]);

    function UpdateMonitoringJobsList(){
        if(!connectedToBackend)
            return;
        //console.debug("Updating MonitoringJobsList");
        Job.GetJobsWithType(apiUri, JobType.DownloadAvailableChaptersJob)
            .then((jobs) => jobs as IDownloadAvailableChaptersJob[])
            .then((jobs) => {
                if(jobs.length != MonitoringJobs.length ||
                    MonitoringJobs.filter(j => jobs.find(nj => nj.jobId == j.jobId)).length > 1 ||
                    jobs.filter(nj => MonitoringJobs.find(j => nj.jobId == j.jobId)).length > 1){
                        setMonitoringJobs(jobs);
                }
            });
    }

    function StartSearchMangaEntry() : ReactElement {
        return (<div key="monitorMangaEntry.StartSearch" className="startSearchEntry MangaItem" onClick={onStartSearch}>
            <img className="MangaItem-Cover" src="../media/blahaj.png" alt="Blahaj"></img>
            <div>
                <div style={{margin: "30px auto", color: "black", textShadow: "1px 2px #f5a9b8"}} className="MangaItem-Name">Add new Manga</div>
                <div style={{fontSize: "42pt", textAlign: "center", textShadow: "1px 2px #5bcefa"}}>+</div>
            </div>
        </div>);
    }

    return (
        <div id="MonitorMangaList">
            <StartSearchMangaEntry />
            {MonitoringJobs.map((MonitoringJob) =>
                <MangaItem apiUri={apiUri} mangaId={MonitoringJob.mangaId} key={MonitoringJob.mangaId}>
                    <></>
                    <button className="Manga-DeleteButton" onClick={() => {
                        Manga.DeleteManga(apiUri, MonitoringJob.mangaId);
                    }}>Delete</button>
                </MangaItem>
            )}
        </div>);
}