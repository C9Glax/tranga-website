import IMangaConnector from "./IMangaConnector";
import KeyValuePair from "./KeyValuePair";
import {Manga} from "../Manga";
import React, {ReactElement} from "react";
import Icon from '@mdi/react';
import { mdiTagTextOutline, mdiAccountEdit } from '@mdi/js';
import MarkdownPreview from '@uiw/react-markdown-preview';
import IJob, {JobTypeFromNumber} from "./IJob";
import {Job} from "../Job";
import ProgressBar from "@ramonak/react-progress-bar";

export default interface IManga{
    "sortName": string,
    "authors": string[],
    "altTitles": KeyValuePair[],
    "description": string,
    "tags": string[],
    "coverUrl": string,
    "coverFileNameInCache": string,
    "links": KeyValuePair[],
    "year": number,
    "originalLanguage": string,
    "releaseStatus": number,
    "folderName": string,
    "publicationId": string,
    "internalId": string,
    "ignoreChaptersBelow": number,
    "latestChapterDownloaded": number,
    "latestChapterAvailable": number,
    "websiteUrl": string,
    "mangaConnector": IMangaConnector
}

export function ReleaseStatusFromNumber(n: number): string {
    switch(n) {
        case 0: return "Ongoing";
        case 1: return "Completed";
        case 2: return "OnHiatus";
        case 3: return "Cancelled";
        case 4: return "Unreleased";
    }
    return "";
}

export function CoverCard(apiUri: string, manga: IManga) : ReactElement {
    return(
    <div className="Manga" key={manga.internalId}>
        <img src={Manga.GetMangaCoverUrl(apiUri, manga.internalId)} alt="Manga Cover"></img>
        <div>
            <p className="pill connector-name">{manga.mangaConnector.name}</p>
            <div className="Manga-status" release-status={ReleaseStatusFromNumber(manga.releaseStatus)}></div>
            <p className="Manga-name">{manga.sortName}</p>
        </div>
    </div>);
}

export function SearchResult(apiUri: string, manga: IManga, createJob: (internalId: string, type: string) => void) : ReactElement {
    return(
        <div className="SearchResult" key={manga.internalId}>
            <img src={Manga.GetMangaCoverUrl(apiUri, manga.internalId)} alt="Manga Cover"></img>
            <p className="connector-name">{manga.mangaConnector.name}</p>
            <div className="Manga-status" release-status={ReleaseStatusFromNumber(manga.releaseStatus)}></div>
            <p className="Manga-name"><a href={manga.websiteUrl}>{manga.sortName}<img src="../../media/link.svg" alt=""/></a></p>
            <div className="Manga-tags">
                {manga.authors.map(author => <p className="Manga-author" key={manga.internalId + "-author-" + author}> <Icon path={mdiAccountEdit} size={0.5} /> {author}</p>)}
                {manga.tags.map(tag => <p className="Manga-tag" key={manga.internalId + "-tag-" + tag}><Icon path={mdiTagTextOutline} size={0.5} /> {tag}</p>)}
            </div>
            <MarkdownPreview className="Manga-description" source={manga.description} style={{ backgroundColor: "transparent", color: "black" }} />
            <button className="Manga-AddButton" onClick={() => {
                createJob(manga.internalId, "MonitorManga")
            }}>Monitor
            </button>
        </div>);
}

function ProgressbarStr(job: IJob): string {
    return job.progressToken.timeRemaining.substring(0,job.progressToken.timeRemaining.indexOf(".")).concat(" ", ToPercentString(job.progressToken.progress));
}

function ToPercentString(n: number): string {
    return n.toString().substring(2,4).concat("%");
}

export function QueueItem(apiUri: string, manga: IManga, job: IJob, triggerUpdate: () => void){
    return (
        <div className="QueueJob" key={"QueueJob-" + job.id}>
            <img src={Manga.GetMangaCoverUrl(apiUri, manga.internalId)} alt="Manga Cover"/>
            <p className="QueueJob-Name">{manga.sortName}</p>
            <p className="QueueJob-JobType">{JobTypeFromNumber(job.jobType)}</p>
            <p className="QueueJob-additional">{job.jobType == 0 ? `Vol.${job.chapter?.volumeNumber} Ch.${job.chapter?.chapterNumber}` : ""}</p>
            {job.progressToken.state === 0
            ? <ProgressBar labelColor={"#000"} height={"10px"} labelAlignment={"outside"} className="QueueJob-Progressbar" completed={job.progressToken.progress} maxCompleted={1} customLabel={ProgressbarStr(job)}/>
            : <div className="QueueJob-Progressbar"></div>}
            <div className="QueueJob-actions">
                <button className="QueueJob-Cancel" onClick={() => Job.CancelJob(apiUri, job.id).then(triggerUpdate)}>Cancel</button>
                {job.parentJobId != null
                    ? <button className="QueueJob-Cancel" onClick={() => Job.CancelJob(apiUri, job.parentJobId!).then(triggerUpdate)}>Cancel all related</button>
                    : <></>
                }
            </div>
        </div>
    );
}