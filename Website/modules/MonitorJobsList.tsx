import React, {EventHandler, ReactElement, useEffect, useState} from 'react';
import Job from './Job';
import '../styles/monitorMangaList.css';
import {JobType} from "./interfaces/Jobs/IJob";
import '../styles/MangaCoverCard.css'
import DownloadAvailableChaptersJob from "./interfaces/Jobs/DownloadAvailableChaptersJob";
import {MangaItem} from "./interfaces/IManga";
import Manga from "./Manga";

export default function MonitorJobsList({onStartSearch, onJobsChanged, connectedToBackend, apiUri, updateList} : {onStartSearch() : void, onJobsChanged: EventHandler<any>, connectedToBackend: boolean, apiUri: string, updateList: Date}) {
    const [MonitoringJobs, setMonitoringJobs] = useState<DownloadAvailableChaptersJob[]>([]);
    const [joblistUpdateInterval, setJoblistUpdateInterval] = React.useState<number>();

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
        Job.GetJobsWithType(apiUri, JobType.DownloadAvailableChaptersJob)
            .then((jobs) => setMonitoringJobs(jobs as DownloadAvailableChaptersJob[]));
    }

    function StartSearchMangaEntry() : ReactElement {
        return (<div key="monitorMangaEntry.StartSearch" className="startSearchEntry MangaItem" onClick={onStartSearch}>
            <img className="MangaItem-Cover" src="../media/blahaj.png" alt="Blahaj"></img>
            <div>
                <p style={{textAlign: "center", width: "100%"}} className="MangaItem-Name">Add new Manga</p>
                <p style={{fontSize: "42pt", textAlign: "center"}}>+</p>
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