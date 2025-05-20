import {
    Card,
    CardContent,
    Chip,
    DialogContent, DialogTitle,
    Drawer,
    Input,
    Option,
    Select,
    Stack,
    Tooltip,
    Typography
} from "@mui/joy";
import {GetAllJobs} from "../api/Job.tsx";
import * as React from "react";
import {useCallback, useContext, useEffect, useState} from "react";
import {ApiUriContext} from "../api/fetchApi.tsx";
import IJob, {JobState, JobType} from "../api/types/Jobs/IJob.ts";
import IJobWithMangaId from "../api/types/Jobs/IJobWithMangaId.ts";
import {MangaFromId} from "./Manga.tsx";
import ModalClose from "@mui/joy/ModalClose";
import IJobWithChapterId from "../api/types/Jobs/IJobWithChapterId.tsx";
import {ChapterFromId} from "./Chapter.tsx";

export default function JobsDrawer({open, connected, setOpen} : {open: boolean, connected: boolean, setOpen:React.Dispatch<React.SetStateAction<boolean>>}) {
    const apiUri = useContext(ApiUriContext);

    const [allJobs, setAllJobs] = useState<IJob[]>([]);

    const [filterState, setFilterState] = useState<string|null>(null);
    const [filterType, setFilterType] = useState<string|null>(null);

    const pageSize = 10;
    const [page, setPage] = useState(1);

    const updateDisplayJobs = useCallback(() => {
        if(!connected)
            return;
        GetAllJobs(apiUri).then(setAllJobs);
    }, [apiUri, connected]);

    const timerRef = React.useRef<ReturnType<typeof setInterval>>(undefined);
    const updateTimer = useCallback(() => {
        if(!connected){
            clearTimeout(timerRef.current);
            return;
        }else{
            if(timerRef.current === undefined) {
                console.log("Added timer!");
                updateDisplayJobs();
                timerRef.current = setInterval(() => {
                    updateDisplayJobs();
                }, 2000);
            }
        }
    }, [open, connected]);

    const FilterJobs = (jobs? : IJob[] | undefined) : IJob[] => {
        if(jobs === undefined)
            return [];
        let ret = jobs;
        if(filterState != undefined)
            ret = ret.filter(job => job.state == filterState);
        if(filterType != undefined)
            ret = ret.filter(job => job.jobType == filterType);
        return ret.sort((a, b) => new Date(a.nextExecution).getDate() - new Date(b.nextExecution).getDate());
    }

    const handleChangeState = (
        _: React.SyntheticEvent | null,
        newValue: string | null,
    ) => {
        setFilterState(newValue);
        setPage(1);
    };
    const handleChangeType = (
        _: React.SyntheticEvent | null,
        newValue: string | null,
    ) => {
        setFilterType(newValue);
        setPage(1);
    };

    useEffect(() => {
        updateTimer();
    }, [open, connected]);

    return (
        <Drawer size={"lg"} anchor={"left"} open={open} onClose={() => setOpen(false)}>
            <ModalClose />
            <DialogTitle><Typography level={"h2"}>Jobs</Typography></DialogTitle>
            <Stack direction={"row"} spacing={2}>
                <Select placeholder={"State"} value={filterState} onChange={handleChangeState} startDecorator={
                    <Typography>State</Typography>
                }>
                    <Option value={null}>None</Option>
                    {Object.keys(JobState).map((state) => <Option value={state}>{state}</Option>)}
                </Select>
                <Select placeholder={"Type"} value={filterType} onChange={handleChangeType} startDecorator={
                    <Typography>Type</Typography>
                }>
                    <Option value={null}>None</Option>
                    {Object.keys(JobType).map((type) => <Option value={type}>{type}</Option>)}
                </Select>
                <Input type={"number"}
                       value={page}
                       onChange={(e) => setPage(parseInt(e.target.value))}
                       slotProps={{input: { min: 1, max: Math.ceil(FilterJobs(allJobs).length / pageSize)}}}
                       startDecorator={<Typography>Page</Typography>}
                        endDecorator={<Typography>/{Math.ceil(FilterJobs(allJobs).length / pageSize)}</Typography>}/>
            </Stack>
            <DialogContent>
                <Stack direction={"column"} spacing={1}>
                    {FilterJobs(allJobs).splice(pageSize*(page-1), pageSize).map(job => <FormatJob key={job.jobId} job={job}/>)}
                </Stack>
            </DialogContent>
        </Drawer>
    )
}

function FormatJob({job} : {job: IJob}) {

    return (
        <Card variant={"solid"}>
            <CardContent>
                <Tooltip title={job.jobId}>
                    <Typography level={"title-lg"}>{job.jobType}</Typography>
                </Tooltip>
            </CardContent>
            <CardContent>
                <Stack direction={"row"} spacing={1}>
                    <Tooltip title={"Last Execution"}>
                        <Chip>{new Date(job.lastExecution).toLocaleString()}</Chip>
                    </Tooltip>
                    <Tooltip title={"Next Execution"}>
                        <Chip>{new Date(job.nextExecution).toLocaleString()}</Chip>
                    </Tooltip>
                    <Chip>{job.state}</Chip>
                </Stack>
            </CardContent>
            <CardContent>
                {ExtraContent(job)}
            </CardContent>
        </Card>
    );
}

function ExtraContent(job: IJob){
    switch(job.jobType){
        case JobType.DownloadAvailableChaptersJob:
        case JobType.DownloadMangaCoverJob:
        case JobType.RetrieveChaptersJob:
        case JobType.UpdateChaptersDownloadedJob:
        case JobType.UpdateCoverJob:
        case JobType.MoveMangaLibraryJob:
            return <MangaFromId key={(job as IJobWithMangaId).mangaId} mangaId={(job as IJobWithMangaId).mangaId} />;
        case JobType.DownloadSingleChapterJob:
        case JobType.UpdateSingleChapterDownloadedJob:
            return <ChapterFromId key={(job as IJobWithChapterId).chapterId} chapterId={(job as IJobWithChapterId).chapterId} />
        default:
            return null;
    }
}