import {Badge, Box, Button, Card, CardContent, CardCover, Stack, Typography} from "@mui/joy";
import {Dispatch, SetStateAction, useCallback, useContext, useEffect, useState} from "react";
import {ApiUriContext} from "../api/fetchApi.tsx";
import {DeleteJob, GetJobsWithType, StartJob} from "../api/Job.tsx";
import {JobType} from "../api/types/Jobs/IJob.ts";
import IDownloadAvailableChaptersJob from "../api/types/Jobs/IDownloadAvailableChaptersJob.ts";
import {CardHeight, CardWidth, MangaFromId} from "./Manga.tsx";
import {PlayArrow, Remove} from "@mui/icons-material";
import * as React from "react";

export default function MangaList({connected, setShowSearch}: {connected: boolean, setShowSearch: Dispatch<SetStateAction<boolean>>} ) {
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

    const startJob = useCallback((jobId: string) => {
        StartJob(apiUri, jobId, true).finally(() => getJobList());
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
            <Badge invisible sx={{margin: "8px !important"}}>
                <Card onClick={() => setShowSearch(true)} sx={{height:"fit-content",width:"fit-content"}}>
                    <CardCover sx={{margin:"var(--Card-padding)"}}>
                        <img src={"/blahaj.png"} style={{height: CardHeight + "px", width: CardWidth + 10 + "px"}} />
                    </CardCover>
                    <CardCover sx={{
                        background: 'rgba(234, 119, 246, 0.14)',
                        backdropFilter: 'blur(6.9px)',
                        webkitBackdropFilter: 'blur(6.9px)',
                    }}/>
                    <CardContent>
                        <Box style={{height: CardHeight + "px", width: CardWidth + 10 + "px"}} >
                            <Typography level={"h1"}>Search</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Badge>
            {jobList?.map((job) => (
                <MangaFromId key={job.mangaId} mangaId={job.mangaId}>
                    <Button color={"success"} endDecorator={<PlayArrow />} onClick={() => startJob(job.jobId)}>Start</Button>
                    <Button color={"danger"} endDecorator={<Remove />} onClick={() => deleteJob(job.jobId)}>Delete</Button>
                </MangaFromId>
            ))}
        </Stack>
    );
}