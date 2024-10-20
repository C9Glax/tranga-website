import React, {useEffect} from 'react';
import '../styles/footer.css';
import {Job} from './Job';
import Icon from '@mdi/react';
import { mdiRun, mdiCounter, mdiEyeCheck, mdiTrayFull } from '@mdi/js';

export default function Footer({showQueue} : {showQueue(): void}){
    const [MonitoringJobsCount, setMonitoringJobsCount] = React.useState(0);
    const [AllJobsCount, setAllJobsCount] = React.useState(0);
    const [RunningJobsCount, setRunningJobsCount] = React.useState(0);
    const [StandbyJobsCount, setStandbyJobsCount] = React.useState(0);

    function UpdateBackendState(){
        Job.GetMonitoringJobs().then((jobs) => setMonitoringJobsCount(jobs.length));
        Job.GetAllJobs().then((jobs) => setAllJobsCount(jobs.length));
        Job.GetRunningJobs().then((jobs) => setRunningJobsCount(jobs.length));
        Job.GetStandbyJobs().then((jobs) => setStandbyJobsCount(jobs.length));
    }

    useEffect(() => {
        UpdateBackendState();
    }, []);

    return (
        <footer>
            <div><Icon path={mdiEyeCheck} size={1}/> <span>{MonitoringJobsCount}</span></div>
            <div onClick={showQueue} className="hoverHand"><Icon path={mdiTrayFull} size={1}/> <span>{StandbyJobsCount}</span></div>
            <div onClick={showQueue} className="hoverHand"><Icon path={mdiRun} size={1}/> <span>{RunningJobsCount}</span></div>
            <div><Icon path={mdiCounter} size={1}/> <span>{AllJobsCount}</span></div>
            <p id="madeWith">Made with Blåhaj 🦈</p>
        </footer>)
}