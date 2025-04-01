import {Button, Stack} from "@mui/joy";
import {useCallback, useContext, useEffect, useState} from "react";
import {ApiUriContext} from "../api/fetchApi.tsx";
import {DeleteJob, GetJobsWithType} from "../api/Job.tsx";
import {JobType} from "../api/types/Jobs/IJob.ts";
import IDownloadAvailableChaptersJob from "../api/types/Jobs/IDownloadAvailableChaptersJob.ts";
import {MangaFromId} from "./Manga.tsx";
import { Remove } from "@mui/icons-material";

export default function MangaList(){
    const apiUri = useContext(ApiUriContext);

    const [jobList, setJobList] = useState<IDownloadAvailableChaptersJob[]>([]);

    const getJobList = useCallback(() => {
        GetJobsWithType(apiUri, JobType.DownloadAvailableChaptersJob).then((jl) => setJobList(jl as IDownloadAvailableChaptersJob[]));
    },[apiUri]);

    const deleteJob = useCallback((jobId: string) => {
        DeleteJob(apiUri, jobId).finally(() => getJobList());
    },[apiUri]);

    useEffect(() => {
        getJobList();
    }, [apiUri]);

    return(
        <Stack direction="row" spacing={1}>
            {jobList.map((job) => (
                <MangaFromId key={job.mangaId} mangaId={job.mangaId}>
                    <Button color={"danger"} endDecorator={<Remove />} onClick={() => deleteJob(job.jobId)}>Delete</Button>
                </MangaFromId>
            ))}
        </Stack>
    );
}