import React, {EventHandler, MouseEventHandler, ReactElement, useEffect, useState} from 'react';
import Job from './Job';
import '../styles/monitorMangaList.css';
import IJob, {JobType} from "./interfaces/IJob";
import IManga from "./interfaces/IManga";
import '../styles/MangaCoverCard.css'

export default function MonitorJobsList({onStartSearch, onJobsChanged, connectedToBackend, apiUri, updateList} : {onStartSearch() : void, onJobsChanged: EventHandler<any>, connectedToBackend: boolean, apiUri: string, updateList: Date}) {
    const [MonitoringJobs, setMonitoringJobs] = useState<IJob[]>([]);
    const [AllManga, setAllManga] = useState<IManga[]>([]);
    const [joblistUpdateInterval, setJoblistUpdateInterval] = React.useState<number>();

    useEffect(() => {

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
        Job.GetJobsWithType(apiUri, JobType.DownloadAvailableChaptersJob)
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
        </div>)
}