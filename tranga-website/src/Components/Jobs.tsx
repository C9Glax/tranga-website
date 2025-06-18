import {
    Button,
    DialogContent, DialogTitle,
    Drawer,
    Input,
    Option,
    Select,
    Stack,
    Table,
    Typography
} from "@mui/joy";
import {GetJobsInState, GetJobsOfTypeAndWithState, GetJobsWithType, StartJob} from "../api/Job.tsx";
import * as React from "react";
import {useCallback, useContext, useEffect, useState} from "react";
import {ApiUriContext} from "../api/fetchApi.tsx";
import IJob, {JobState, JobStateToString, JobType, JobTypeToString} from "../api/types/Jobs/IJob.ts";
import ModalClose from "@mui/joy/ModalClose";
import {MangaPopupFromId} from "./MangaPopup.tsx";
import IJobWithMangaId from "../api/types/Jobs/IJobWithMangaId.ts";
import {ChapterPopupFromId} from "./Chapter.tsx";
import IJobWithChapterId from "../api/types/Jobs/IJobWithChapterId.tsx";

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
        if (filterState === null && filterType === null)
            setAllJobs([]);
        else if (filterState === null && filterType != null)
            GetJobsWithType(apiUri, filterType as unknown as JobType).then(setAllJobs);
        else if (filterState != null && filterType === null)
            GetJobsInState(apiUri, filterState as unknown as JobState).then(setAllJobs);
        else if (filterState != null && filterType != null)
            GetJobsOfTypeAndWithState(apiUri, filterType as unknown as JobType, filterState as unknown as JobState).then(setAllJobs);
    }, [connected, filterType, filterState]);
    
    const timerRef = React.useRef<ReturnType<typeof setInterval>>(undefined);
    useEffect(() => {
        clearTimeout(timerRef.current);
        updateDisplayJobs();
        timerRef.current = setInterval(updateDisplayJobs, 2000);
    }, [filterState, filterType]);

    useEffect(() => {
        if (!open || !connected)
            clearTimeout(timerRef.current);
    }, [open, connected]);

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
    
    const [mangaPopupOpen, setMangaPopupOpen] = React.useState(false);
    const [selectedMangaId, setSelectedMangaId] = useState<string | null>(null);
    const OpenMangaPopupDrawer = (mangaId: string) => {
        setSelectedMangaId(mangaId);
        setMangaPopupOpen(true);
    }
    
    const [chapterPopupOpen, setChapterPopupOpen] = React.useState(false);
    const [selectedChapterId, setSelectedChapterId] = React.useState<string | null>(null);
    const OpenChapterPopupDrawer = (chapterId: string) => {
        setSelectedChapterId(chapterId);
        setChapterPopupOpen(true);
    }
    
    const ReRunJob = useCallback((jobId: string) => {
        StartJob(apiUri, jobId, false);
    }, [apiUri]);

    return (
        <Drawer size={"lg"} anchor={"left"} open={open} onClose={() => setOpen(false)}>
            <ModalClose />
            <DialogTitle><Typography level={"h2"}>Jobs</Typography></DialogTitle>
            <Stack direction={"row"} spacing={2}>
                <Select placeholder={"State"} value={filterState} onChange={handleChangeState} startDecorator={
                    <Typography>State</Typography>
                }>
                    <Option value={null}>None</Option>
                    {Object.keys(JobState).map((state) => <Option value={state}>{JobStateToString(state)}</Option>)}
                </Select>
                <Select placeholder={"Type"} value={filterType} onChange={handleChangeType} startDecorator={
                    <Typography>Type</Typography>
                }>
                    <Option value={null}>None</Option>
                    {Object.keys(JobType).map((type) => <Option value={type}>{JobTypeToString(type)}</Option>)}
                </Select>
                <Input type={"number"}
                       value={page}
                       onChange={(e) => setPage(parseInt(e.target.value))}
                       slotProps={{input: { min: 1, max: Math.ceil(allJobs.length / pageSize)}}}
                       startDecorator={<Typography>Page</Typography>}
                       endDecorator={<Typography>/{Math.ceil(allJobs.length / pageSize)}</Typography>}/>
            </Stack>
            <DialogContent>
                <Table borderAxis={"bothBetween"} stickyHeader sx={{tableLayout: "auto", width: "100%"}}>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>State</th>
                            <th>Last Execution</th>
                            <th>Next Execution</th>
                            <th></th>
                            <th>Extra</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allJobs.slice((page-1)*pageSize, page*pageSize).map((job) => (
                            <tr key={job.jobId}>
                                <td>{JobTypeToString(job.jobType)}</td>
                                <td>{JobStateToString(job.state)}</td>
                                <td>{new Date(job.lastExecution).toLocaleString()}</td>
                                <td>{new Date(job.nextExecution).toLocaleString()}</td>
                                <td style={{whiteSpace: "nowrap"}}><Button onClick={() => ReRunJob(job.jobId)}>Re-Run</Button></td>
                                <td>{ExtraContent(job, OpenMangaPopupDrawer, OpenChapterPopupDrawer)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </DialogContent>
            <MangaPopupFromId mangaId={selectedMangaId} open={mangaPopupOpen} setOpen={setMangaPopupOpen} />
            <ChapterPopupFromId chapterId={selectedChapterId} open={chapterPopupOpen} setOpen={setChapterPopupOpen} />
        </Drawer>
    )
}

function ExtraContent(job: IJob, OpenMangaPopupDrawer: (mangaId: string) => void, OpenChapterPopupDrawer: (IJobWithChapterId: string) => void){
    switch(job.jobType){
        case JobType.DownloadAvailableChaptersJob:
        case JobType.DownloadMangaCoverJob:
        case JobType.RetrieveChaptersJob:
        case JobType.UpdateChaptersDownloadedJob:
        case JobType.UpdateCoverJob:
        case JobType.MoveMangaLibraryJob:
            return <Button onClick={() => OpenMangaPopupDrawer((job as IJobWithMangaId).mangaId)}>Open Manga</Button>
        case JobType.DownloadSingleChapterJob:
            return <Button onClick={() => OpenChapterPopupDrawer((job as IJobWithChapterId).chapterId)}>Show Chapter</Button>
        default:
            return null;
    }
}