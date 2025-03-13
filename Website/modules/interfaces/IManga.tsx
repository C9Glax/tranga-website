import Manga from "../Manga";
import React, {ReactElement, ReactEventHandler} from "react";
import Icon from '@mdi/react';
import { mdiTagTextOutline, mdiAccountEdit, mdiLinkVariant } from '@mdi/js';
import MarkdownPreview from '@uiw/react-markdown-preview';
import IJob from "./IJob";
import {AuthorElement} from "./IAuthor";
import Job from "../Job";
import {LinkElement} from "./ILink";

export default interface IManga{
    mangaId: string;
    connectorId: string;
    name: string;
    description: string;
    websiteUrl: string;
    year: number;
    originalLanguage: string;
    releaseStatus: MangaReleaseStatus;
    folderName: string;
    ignoreChapterBefore: number;
    mangaConnectorId: string;
    authorIds: string[];
    tags: string[];
    linkIds: string[];
    altTitleIds: string[];
}

export enum MangaReleaseStatus {
    Continuing = "Continuing",
    Completed = "Completed",
    OnHiatus = "OnHiatus",
    Cancelled = "Cancelled",
    Unreleased = "Unreleased",
}

export function CoverCard(apiUri: string, manga: IManga) : ReactElement {
    return(
        <div className="Manga" key={manga.mangaId}>
            <img src="../../media/blahaj.png" alt="Manga Cover"></img>
            <div>
                <p className="pill connector-name">{manga.mangaConnectorId}</p>
                <div className="Manga-status" release-status={manga.releaseStatus}></div>
                <p className="Manga-name">{manga.name}</p>
            </div>
        </div>);
}

export function SearchResult(apiUri: string, manga: IManga, interval: Date, onJobsChanged: (internalId: string) => void) : ReactElement {
    const MangaCover : ReactEventHandler<HTMLImageElement> = (e) => {
        console.log(manga.mangaId);
        if(e.currentTarget.src != Manga.GetMangaCoverImageUrl(apiUri, manga.mangaId, e.currentTarget))
            e.currentTarget.src = Manga.GetMangaCoverImageUrl(apiUri, manga.mangaId, e.currentTarget);
    }

    return(
        <div className="SearchResult" key={manga.mangaId}>
            <img src={Manga.GetMangaCoverImageUrl(apiUri, manga.mangaId, undefined)} alt="Manga Cover" onLoad={MangaCover}></img>
            <p className="connector-name">{manga.mangaConnectorId}</p>
            <div className="Manga-status" release-status={manga.releaseStatus}></div>
            <p className="Manga-name"><a href={manga.websiteUrl}>{manga.name}<img src="../../media/link.svg"
                                                                                      alt=""/></a></p>
            <div className="Manga-tags">
                {manga.authorIds.map(authorId =>
                    <p className="Manga-author" key={manga.mangaId + "-author-" + authorId} >
                        <Icon path={mdiAccountEdit} size={0.5} />
                        <AuthorElement apiUri={apiUri} authorId={authorId}></AuthorElement>
                    </p>)}
                {manga.tags.map(tag =>
                    <p className="Manga-tag" key={manga.mangaId + "-tag-" + tag}>
                        <Icon path={mdiTagTextOutline} size={0.5}/>
                        {tag}
                    </p>)}
                {manga.linkIds.map(linkId =>
                    <p className="Manga-link" key={manga.mangaId + "-link-" + linkId}>
                        <Icon path={mdiLinkVariant} size={0.5}/>
                        <LinkElement apiUri={apiUri} linkId={linkId}></LinkElement>
                    </p>)}
            </div>
            <MarkdownPreview className="Manga-description" source={manga.description}
                             style={{backgroundColor: "transparent", color: "black"}}/>
            <button className="Manga-AddButton" onClick={() => {
                Job.CreateDownloadAvailableChaptersJob(apiUri, manga.mangaId, interval.getMilliseconds()).then(() => onJobsChanged(manga.mangaId));
            }}>Monitor
            </button>
        </div>);
}

export function QueueItem(apiUri: string, manga: IManga, job: IJob, triggerUpdate: () => void){
    return (
        <div className="QueueJob" key={"QueueJob-" + job.jobId}>
            <img src="../../media/blahaj.png" alt="Manga Cover"></img>
            <p className="QueueJob-Name">{manga.name}</p>
            <p className="QueueJob-JobType">{job.jobType}</p>
            <div className="QueueJob-actions">
                <button className="QueueJob-Cancel"
                        onClick={() => Job.StopJob(apiUri, job.jobId).then(triggerUpdate)}>Cancel
                </button>
                {job.parentJobId != null
                    ? <button className="QueueJob-Cancel"
                              onClick={() => Job.StopJob(apiUri, job.parentJobId!).then(triggerUpdate)}>Cancel all
                        related</button>
                    : <></>
                }
            </div>
        </div>
    );
}