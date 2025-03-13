import React, {useEffect, useState} from 'react';
import IJob, {JobState} from "./interfaces/IJob";
import '../styles/queuePopUp.css';
import '../styles/popup.css';
import Job from "./Job";
import IManga, {QueueItem} from "./interfaces/IManga";
import Manga from "./Manga";

export default function QueuePopUp({connectedToBackend, children, apiUri} : {connectedToBackend: boolean, children: JSX.Element[], apiUri: string}) {

    const [WaitingJobs, setWaitingJobs] = React.useState<IJob[]>([]);
    const [RunningJobs, setRunningJobs] = React.useState<IJob[]>([]);
    const [showQueuePopup, setShowQueuePopup] = useState<boolean>(false);
    const [queueListInterval, setQueueListInterval] = React.useState<number>();

    useEffect(() => {
        if(!showQueuePopup)
            return;
        UpdateMonitoringJobsList();
    }, [showQueuePopup]);

    useEffect(() => {
        if(connectedToBackend){
            UpdateMonitoringJobsList();
            setQueueListInterval(setInterval(() => {
                UpdateMonitoringJobsList();
            }, 2000));
        }else{
            clearInterval(queueListInterval);
            setQueueListInterval(undefined);
        }
    }, [connectedToBackend]);

    function UpdateMonitoringJobsList(){
        Job.GetJobsInState(apiUri, JobState.Waiting)
            .then((jobs:IJob[]) => {
                //console.log(StandbyJobs)
                setWaitingJobs(jobs);
                //console.log(StandbyJobs)
            });
        Job.GetJobsInState(apiUri, JobState.Running)
            .then((jobs:IJob[]) =>{
                //console.log(StandbyJobs)
                setRunningJobs(jobs);
                //console.log(StandbyJobs)
            });
    }

    return (<>
            <div onClick={() => setShowQueuePopup(true)}>
                {children}
            </div>
            {showQueuePopup
                ? <div className="popup" id="QueuePopUp">
                    <div className="popupHeader">
                        <h1>Queue Status</h1>
                        <img alt="Close Search" className="close" src="../media/close-x.svg"
                             onClick={() => setShowQueuePopup(false)}/>
                    </div>
                    <div id="QueuePopUpBody" className="popupBody">
                    </div>
                </div>
                : <></>
            }
        </>
    );
}