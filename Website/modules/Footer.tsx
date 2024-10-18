import React, {useEffect} from 'react';
import '../styles/footer.css';
import {Job} from './Job';

export default function Footer(){
    const [MonitoringJobsCount, setMonitoringJobsCount] = React.useState(0);
    const [AllJobsCount, setAllJobsCount] = React.useState(0);
    const [RunningJobsCount, setRunningJobsCount] = React.useState(0);

    function UpdateBackendState(){
        Job.GetMonitoringJobs().then((jobs) => setMonitoringJobsCount(jobs.length));
        Job.GetAllJobs().then((jobs) => setAllJobsCount(jobs.length));
        Job.GetRunningJobs().then((jobs) => setRunningJobsCount(jobs.length));
    }

    useEffect(() => {
        UpdateBackendState();
    }, []);

    return (
    <footer>
        <p>{MonitoringJobsCount}</p>
        <p>{AllJobsCount}</p>
        <p>{RunningJobsCount}</p>
        <p id="madeWith">Made with Blåhaj 🦈</p>
    </footer>)
}