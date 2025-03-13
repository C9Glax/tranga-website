import Manga from "../Manga";
import React, {ReactElement, ReactEventHandler, useEffect} from "react";
import Icon from '@mdi/react';
import { mdiTagTextOutline, mdiAccountEdit, mdiLinkVariant } from '@mdi/js';
import MarkdownPreview from '@uiw/react-markdown-preview';
import {AuthorElement} from "./IAuthor";
import {LinkElement} from "./ILink";
import DownloadSingleChapterJob from "./Jobs/DownloadSingleChapterJob";
import IChapter from "./IChapter";
import Chapter from "../Chapter";

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

export const defaultManga: IManga = {
    altTitleIds: [],
    authorIds: [],
    connectorId: "",
    description: "",
    folderName: "",
    ignoreChapterBefore: 0,
    linkIds: [],
    mangaConnectorId: "",
    name: "",
    originalLanguage: "",
    releaseStatus: MangaReleaseStatus.Unreleased,
    tags: [],
    websiteUrl: "",
    year: 0,
    mangaId: ""
}

export function CoverCard({apiUri, mangaId} : {apiUri: string, mangaId: string}) : ReactElement {
    let [manga, setContent] = React.useState<IManga>(defaultManga);
    let [extendedInfo, setExtendedInfo] = React.useState(false);

    useEffect(() => {
        Manga.GetMangaById(apiUri, mangaId).then(setContent);
    }, []);

    const MangaCover : ReactEventHandler<HTMLImageElement> = (e) => {
        if(e.currentTarget.src != Manga.GetMangaCoverImageUrl(apiUri, manga.mangaId, e.currentTarget))
            e.currentTarget.src = Manga.GetMangaCoverImageUrl(apiUri, manga.mangaId, e.currentTarget);
    }

    return (
        <div className="Manga" key={manga.mangaId} onClick={(e) => {
            setExtendedInfo(!extendedInfo);
        }}>
            <img src={Manga.GetMangaCoverImageUrl(apiUri, manga.mangaId, undefined)} alt="Manga Cover" onLoad={MangaCover} onResize={MangaCover}></img>
            <div className="SimpleCover">
                <p className="pill connector-name">{manga.mangaConnectorId}</p>
                <div className="Manga-status" release-status={manga.releaseStatus}></div>
                <p className="Manga-name">{manga.name}</p>
            </div>
            {extendedInfo ? <div extended-info={extendedInfo ? "yes" : "no"}>
                <ExtendedInfo apiUri={apiUri} manga={manga} actions={[
                    <button className="Manga-DeleteButton" onClick={() => {
                        Manga.DeleteManga(apiUri, manga.mangaId);
                    }}>Delete</button>
                ]} />
            </div> : null}
        </div>);
}

export function ExtendedInfo({apiUri, manga, actions} : {apiUri: string, manga: IManga, actions: ReactElement[]}) : ReactElement {
    const MangaCover : ReactEventHandler<HTMLImageElement> = (e) => {
        if(e.currentTarget.src != Manga.GetMangaCoverImageUrl(apiUri, manga.mangaId, e.currentTarget))
            e.currentTarget.src = Manga.GetMangaCoverImageUrl(apiUri, manga.mangaId, e.currentTarget);
    }

    return(
        <div className="SearchResult" key={manga.mangaId}>
            <img src={Manga.GetMangaCoverImageUrl(apiUri, manga.mangaId, undefined)} alt="Manga Cover" onLoad={MangaCover} onResize={MangaCover}></img>
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
            <div className="Manga-actions">
                {actions.map((p, i) => <div key={i}>{p}</div>)}
            </div>
        </div>);
}

export function ItemDownloadSingleChapterJob({apiUri, job} : {apiUri: string, job: DownloadSingleChapterJob}){
    const MangaCover : ReactEventHandler<HTMLImageElement> = (e) => {
        if(manga === null)
            return;
        if(e.currentTarget.src != Manga.GetMangaCoverImageUrl(apiUri, manga.mangaId, e.currentTarget))
            e.currentTarget.src = Manga.GetMangaCoverImageUrl(apiUri, manga.mangaId, e.currentTarget);
    }

    let [chapter, setChapter] = React.useState<IChapter|null>(null);
    let [manga, setManga] = React.useState<IManga|null>(null);

    useEffect(() => {
        Chapter.GetChapterFromId(apiUri, job.chapterId).then(setChapter);
    }, []);

    useEffect(() => {
        if(chapter === null){
            setManga(null);
            return;
        }
        Manga.GetMangaById(apiUri, chapter.parentMangaId).then(setManga);
    }, [chapter]);

    return (
        <div className="DownloadSingleChapterJob" key={"DownloadSingleChapterJob-" + job.jobId}>
            <img src={manga ? Manga.GetMangaCoverImageUrl(apiUri, manga.mangaId, undefined) : ""} alt="Manga Cover" onLoad={MangaCover} onResize={MangaCover}></img>
            <p className="DownloadSingleChapterJob-Name">{manga ? manga.name : job.chapterId}</p>
            <p className="DownloadSingleChapterJob-Title">
                {chapter ? "Vol." + chapter.volumeNumber + " Ch." + chapter.chapterNumber + ": " + chapter.title : "loading"}
                <a href={chapter ? chapter.url : ""}>
                    <img src="../../media/link.svg" alt=""/>
                </a>
            </p>
        </div>
    );
}