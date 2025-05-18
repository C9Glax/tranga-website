import {Button, Stack} from "@mui/joy";
import {useCallback, useContext, useEffect, useState} from "react";
import {ApiUriContext} from "../api/fetchApi.tsx";
import {DeleteJob, GetJobsWithType} from "../api/Job.tsx";
import {JobType} from "../api/types/Jobs/IJob.ts";
import IDownloadAvailableChaptersJob from "../api/types/Jobs/IDownloadAvailableChaptersJob.ts";
import {MangaFromId} from "./Manga.tsx";
import { Remove } from "@mui/icons-material";
import * as React from "react";

export default function MangaList({connected, children}: {connected: boolean, children?: React.ReactNode} ){
    const apiUri = useContext(ApiUriContext);

    const [jobList, setJobList] = useState<IDownloadAvailableChaptersJob[]>([]);

    const getJobList = useCallback(() => {
        if(!connected)
            return;
        GetJobsWithType(apiUri, JobType.DownloadAvailableChaptersJob).then((jl) => setJobList(jl as IDownloadAvailableChaptersJob[]));
    },[apiUri,connected]);

    const deleteJob = useCallback((jobId: string) => {
        DeleteJob(apiUri, jobId).finally(() => getJobList());
    },[apiUri]);

    useEffect(() => {
        getJobList();
    }, [apiUri]);

    useEffect(() => {
        updateTimer();
        getJobList();
    }, [connected]);

    const timerRef = React.useRef<ReturnType<typeof setInterval>>(undefined);
    const updateTimer = () => {
        if(!connected){
            clearTimeout(timerRef.current);
            return;
        }else{
            if(timerRef.current === undefined) {
                console.log("Added timer!");
                getJobList();
                timerRef.current = setInterval(() => {
                    getJobList();
                }, 2000);
            }
        }
    }

    return(
        <Stack direction="row" spacing={1} flexWrap={"wrap"}>
            {children}
            {jobList?.map((job) => (
                <MangaFromId key={job.mangaId} mangaId={job.mangaId}>
                    <Button color={"danger"} endDecorator={<Remove />} onClick={() => deleteJob(job.jobId)}>Delete</Button>
                </MangaFromId>
            ))}
        </Stack>
    );
}