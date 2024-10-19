import React, {MouseEventHandler, ReactElement, useEffect} from 'react';
import {Job} from './Job';
import '../styles/monitorMangaList.css';
import IJob from "./interfaces/IJob";
import IManga, {HTMLFromIManga} from "./interfaces/IManga";
import {Manga} from './Manga';

export default function MonitorJobsList({onStartSearch} : {onStartSearch() : void}){
    const [MonitoringJobs, setMonitoringJobs] = React.useState<IJob[]>([]);
    const [AllManga, setAllManga] = React.useState<IManga[]>([]);

    function UpdateMonitoringJobsList(){
        Job.GetMonitoringJobs()
            .then((jobs) => {
                if(jobs.length > 0)
                    return Job.GetJobs(jobs)
                return [];
            })
            .then((jobs) => setMonitoringJobs(jobs));
    }

    useEffect(() => {
        //Remove all Manga that are not associated with a Job
        setAllManga(AllManga.filter(manga => MonitoringJobs.find(job => job.mangaInternalId == manga.internalId)));
        //Fetch Manga that are missing (from Jobs)
        if(MonitoringJobs === null)
            return;
        MonitoringJobs.forEach(job => {
            if(AllManga.find(manga => manga.internalId == job.mangaInternalId))
                return;
            Manga.GetMangaById(job.mangaInternalId).then((manga: IManga) => setAllManga([...AllManga, manga]));
        });
    }, [MonitoringJobs]);

    useEffect(() => {
        UpdateMonitoringJobsList();
    }, []);

    const DeleteJob:MouseEventHandler = (e) => {
        const jobId = e.currentTarget.id;
        Job.DeleteJob(jobId);
    }

    function StartSearchMangaEntry() : ReactElement {
        return (<div key="monitorMangaEntry.StartSearch" className="monitorMangaEntry" onClick={onStartSearch}>
            <div className="Manga" key="StartSearch.Manga">
                <img src="../media/blahaj.png"></img>
                <div>
                    <p style={{textAlign: "center", width: "100%"}} className="Manga-name">Add new Manga</p>
                    <p style={{fontSize: "42pt", textAlign: "center"}}>+</p>
                </div>
            </div>
        </div>);
    }

    return (
        <div id="MonitorMangaList">
            {StartSearchMangaEntry()}
            {AllManga.map((manga: IManga) => {
                const job = MonitoringJobs.find(job => job.mangaInternalId == manga.internalId);
                if (job === undefined || job == null)
                    return <div>Error. Could not find matching job for {manga.internalId}</div>
                return <div key={"monitorMangaEntry." + manga.internalId} className="monitorMangaEntry">
                    {HTMLFromIManga(manga)}
                    {job.id}
                    <button id={job.id} onClick={DeleteJob}>Delete</button>
                </div>;
            })}
        </div>)
}