import IMangaConnector from "./IMangaConnector";
import KeyValuePair from "./KeyValuePair";
import {Manga} from "../Manga";
import React, {EventHandler, ReactElement} from "react";
import {Job} from "../Job";
import Icon from '@mdi/react';
import { mdiTagTextOutline, mdiAccountEdit } from '@mdi/js';
import MarkdownPreview from '@uiw/react-markdown-preview';

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

export function CoverCard(manga: IManga) : ReactElement {
    return(
    <div className="Manga" key={manga.internalId}>
        <img src={Manga.GetMangaCoverUrl(manga.internalId)}></img>
        <div>
            <p className="pill connector-name">{manga.mangaConnector.name}</p>
            <div className="Manga-status" release-status={ReleaseStatusFromNumber(manga.releaseStatus)}></div>
            <p className="Manga-name">{manga.sortName}</p>
        </div>
    </div>);
}

export function SearchResult(manga: IManga, createJob: (internalId: string, type: string) => void) : ReactElement {
    return(
        <div className="SearchResult" key={manga.internalId}>
            <img src={Manga.GetMangaCoverUrl(manga.internalId)}></img>
            <p className="connector-name">{manga.mangaConnector.name}</p>
            <div className="Manga-status" release-status={ReleaseStatusFromNumber(manga.releaseStatus)}></div>
            <p className="Manga-name"><a href={manga.websiteUrl}>{manga.sortName}<img src="../../media/link.svg" /></a></p>
            <div className="Manga-tags">
                {manga.authors.map(author => <p className="Manga-author" key={manga.internalId + "-author-" + author}> <Icon path={mdiAccountEdit} size={0.5} /> {author}</p>)}
                {manga.tags.map(tag => <p className="Manga-tag" key={manga.internalId + "-tag-" + tag}><Icon path={mdiTagTextOutline} size={0.5} /> {tag}</p>)}
            </div>
            <MarkdownPreview className="Manga-description" source={manga.description} style={{ backgroundColor: "transparent", color: "black" }} />
            <button className="Manga-AddButton" onClick={(e) => {
                createJob(manga.internalId, "MonitorManga")
            }}>Monitor
            </button>
        </div>);
}