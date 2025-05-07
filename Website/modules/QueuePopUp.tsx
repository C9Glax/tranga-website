import React, {ReactElement, useEffect, useState} from 'react';
import IJob, {JobState, JobType} from "./types/Jobs/IJob";
import '../styles/queuePopUp.css';
import '../styles/popup.css';
import Job from "./api/Job";
import IDownloadSingleChapterJob from "./types/Jobs/IDownloadSingleChapterJob";
import ChapterItem from "./Elements/Chapter";

export default function QueuePopUp({connectedToBackend, children, apiUri, checkConnectedInterval} : {connectedToBackend: boolean, children: ReactElement[], apiUri: string, checkConnectedInterval: number}) {

    const [WaitingJobs, setWaitingJobs] = React.useState<IJob[]>([]);
    const [RunningJobs, setRunningJobs] = React.useState<IJob[]>([]);
    const [showQueuePopup, setShowQueuePopup] = useState<boolean>(false);
    const [queueListInterval, setQueueListInterval] = React.useState<number | undefined>(undefined);

    useEffect(() => {
        if(connectedToBackend && showQueuePopup) {
            UpdateMonitoringJobsList();
            if(queueListInterval === undefined){
                setQueueListInterval(setInterval(() => {
                    UpdateMonitoringJobsList();
                }, checkConnectedInterval));
            }
        }else{
            clearInterval(queueListInterval);
            setQueueListInterval(undefined);
        }
    }, [connectedToBackend, showQueuePopup]);

    function UpdateMonitoringJobsList(){
        Job.GetJobsInState(apiUri, JobState.Waiting)
            .then((jobs: IJob[]) => {
                //console.log(jobs);
                return jobs;
            })
            .then(setWaitingJobs);
        Job.GetJobsInState(apiUri, JobState.Running)
            .then((jobs: IJob[]) => {
                //console.log(jobs);
                return jobs;
            })
            .then(setRunningJobs);
    }

    return (<>
            <div onClick={() => setShowQueuePopup(true)}>
                {children}
            </div>
            {showQueuePopup
                ? <div className="popup" id="QueuePopUp">
                    <div className="popupHeader">
                        <h1>Queue Status</h1>
                        <img alt="Close Queue" className="close" src="../media/close-x.svg"
                             onClick={() => setShowQueuePopup(false)}/>
                    </div>
                    <div id="QueuePopUpBody" className="popupBody">
                        <div>
                            {RunningJobs.filter(j => j.jobType == JobType.DownloadSingleChapterJob).map(j => {
                                let job = j as IDownloadSingleChapterJob;
                                return <ChapterItem apiUri={apiUri} chapterId={job.chapterId} />
                            })}
                        </div>
                        <div>
                            {WaitingJobs.filter(j => j.jobType == JobType.DownloadSingleChapterJob).map(j =>{
                                let job = j as IDownloadSingleChapterJob;
                                return <ChapterItem apiUri={apiUri} chapterId={job.chapterId} />
                            })}
                        </div>
                    </div>
                </div>
                : null
            }
        </>
    );
}