import React, {useEffect} from 'react';
import '../styles/footer.css';
import {Job} from './Job';
import Icon from '@mdi/react';
import { mdiRun, mdiCounter, mdiEyeCheck, mdiTrayFull } from '@mdi/js';
import QueuePopUp from "./QueuePopUp";

export default function Footer({connectedToBackend} : {connectedToBackend: boolean}) {
    const [MonitoringJobsCount, setMonitoringJobsCount] = React.useState(0);
    const [AllJobsCount, setAllJobsCount] = React.useState(0);
    const [RunningJobsCount, setRunningJobsCount] = React.useState(0);
    const [StandbyJobsCount, setStandbyJobsCount] = React.useState(0);
    const [countUpdateInterval, setcountUpdateInterval] = React.useState<number>();

    function UpdateBackendState(){
        Job.GetMonitoringJobs().then((jobs) => setMonitoringJobsCount(jobs.length));
        Job.GetAllJobs().then((jobs) => setAllJobsCount(jobs.length));
        Job.GetRunningJobs().then((jobs) => setRunningJobsCount(jobs.length));
        Job.GetStandbyJobs().then((jobs) => setStandbyJobsCount(jobs.length));
    }

    useEffect(() => {
        if(connectedToBackend){
            UpdateBackendState();
            setcountUpdateInterval(setInterval(() => {
                UpdateBackendState();
            }, 2000));
        }else{
            clearInterval(countUpdateInterval);
            setcountUpdateInterval(undefined);
        }
    }, [connectedToBackend]);

    return (
        <footer>
            <div className="statusBadge"><Icon path={mdiEyeCheck} size={1}/> <span>{MonitoringJobsCount}</span></div>
            <QueuePopUp>
                <div className="statusBadge hoverHand"><Icon path={mdiTrayFull} size={1}/> <span>{StandbyJobsCount}</span></div>
                <div className="statusBadge hoverHand"><Icon path={mdiRun} size={1}/> <span>{RunningJobsCount}</span></div>
            </QueuePopUp>
            <div className="statusBadge"><Icon path={mdiCounter} size={1}/> <span>{AllJobsCount}</span></div>
            <p id="madeWith">Made with Blåhaj 🦈</p>
        </footer>)
}