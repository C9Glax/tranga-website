import React, {useEffect} from 'react';
import '../styles/footer.css';
import Job from './api/Job';
import Icon from '@mdi/react';
import {mdiCounter, mdiEyeCheck, mdiRun, mdiTrayFull} from '@mdi/js';
import QueuePopUp from "./QueuePopUp";
import {JobState, JobType} from "./types/Jobs/IJob";

export default function Footer({connectedToBackend, apiUri, checkConnectedInterval} : {connectedToBackend: boolean, apiUri: string, checkConnectedInterval: number}) {
    const [MonitoringJobsCount, setMonitoringJobsCount] = React.useState(0);
    const [AllJobsCount, setAllJobsCount] = React.useState(0);
    const [RunningJobsCount, setRunningJobsCount] = React.useState(0);
    const [WaitingJobsCount, setWaitingJobs] = React.useState(0);
    const [countUpdateInterval, setCountUpdateInterval] = React.useState<number | undefined>(undefined);

    function UpdateBackendState(){
        Job.GetJobsWithType(apiUri, JobType.DownloadAvailableChaptersJob).then((jobs) => setMonitoringJobsCount(jobs.length));
        Job.GetAllJobs(apiUri).then((jobs) => setAllJobsCount(jobs.length));
        Job.GetJobsInState(apiUri, JobState.Running).then((jobs) => setRunningJobsCount(jobs.length));
        Job.GetJobsInState(apiUri, JobState.Waiting).then((jobs) => setWaitingJobs(jobs.length));
    }

    useEffect(() => {
        if(connectedToBackend){
            UpdateBackendState();
            if(countUpdateInterval === undefined){
                setCountUpdateInterval(setInterval(() => {
                    UpdateBackendState();
                }, checkConnectedInterval * 5));
            }
        }else{
            clearInterval(countUpdateInterval);
            setCountUpdateInterval(undefined);
        }
    }, [connectedToBackend]);

    return (
        <footer>
            <div className="statusBadge" ><Icon path={mdiEyeCheck} size={1}/> <span>{MonitoringJobsCount}</span></div>
            <span>+</span>
            <QueuePopUp connectedToBackend={connectedToBackend} apiUri={apiUri} checkConnectedInterval={checkConnectedInterval}>
                <div className="statusBadge hoverHand"><Icon path={mdiRun} size={1}/> <span>{RunningJobsCount}</span>
                </div>
                <span>+</span>
                <div className="statusBadge hoverHand"><Icon path={mdiTrayFull} size={1}/><span>{WaitingJobsCount}</span></div>
            </QueuePopUp>
            <span>=</span>
            <div className="statusBadge"><Icon path={mdiCounter} size={1}/> <span>{AllJobsCount}</span></div>
            <p id="madeWith">Made with Blåhaj 🦈</p>
        </footer>)
}