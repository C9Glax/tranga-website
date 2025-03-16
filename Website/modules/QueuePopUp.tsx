import React, {useEffect, useState} from 'react';
import IJob, {JobState, JobType} from "./interfaces/Jobs/IJob";
import '../styles/queuePopUp.css';
import '../styles/popup.css';
import Job from "./Job";
import DownloadSingleChapterJob from "./interfaces/Jobs/DownloadSingleChapterJob";
import { MangaItem } from "./interfaces/IManga";
import {ChapterItem} from "./interfaces/IChapter";

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
                        <img alt="Close Search" className="close" src="../media/close-x.svg"
                             onClick={() => setShowQueuePopup(false)}/>
                    </div>
                    <div id="QueuePopUpBody" className="popupBody">
                        <div>
                            {RunningJobs.filter(j => j.jobType == JobType.DownloadSingleChapterJob).map(j => {
                                let job = j as DownloadSingleChapterJob;
                                return <ChapterItem apiUri={apiUri} chapterId={job.chapterId} />
                            })}
                        </div>
                        <div>
                            {WaitingJobs.filter(j => j.jobType == JobType.DownloadSingleChapterJob).map(j =>{
                                let job = j as DownloadSingleChapterJob;
                                return <ChapterItem apiUri={apiUri} chapterId={job.chapterId} />
                            })}
                        </div>
                    </div>
                </div>
                : <></>
            }
        </>
    );
}