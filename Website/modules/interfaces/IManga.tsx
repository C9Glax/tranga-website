import MangaFunctions from "../MangaFunctions";
import React, {Children, ReactElement, ReactEventHandler, useEffect, useState} from "react";
import Icon from '@mdi/react';
import { mdiTagTextOutline, mdiAccountEdit, mdiLinkVariant } from '@mdi/js';
import MarkdownPreview from '@uiw/react-markdown-preview';
import {AuthorElement} from "./IAuthor";
import {LinkElement} from "./ILink";
import IChapter from "./IChapter";
import Loader from "../Loader";

export default interface IManga{
    mangaId: string;
    idOnConnectorSite: string;
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

export function MangaItem({apiUri, mangaId, children} : {apiUri: string, mangaId: string, children?: (string | ReactElement)[]}) : ReactElement {
    const LoadMangaCover : ReactEventHandler<HTMLImageElement> = (e) => {
        if(e.currentTarget.src != MangaFunctions.GetMangaCoverImageUrl(apiUri, mangaId, e.currentTarget))
            e.currentTarget.src = MangaFunctions.GetMangaCoverImageUrl(apiUri, mangaId, e.currentTarget);
    }

    let [manga, setManga] = useState<IManga | null>(null);
    let [clicked, setClicked] = useState<boolean>(false);
    let [latestChapterDownloaded, setLatestChapterDownloaded] = useState<IChapter | null>(null);
    let [latestChapterAvailable, setLatestChapterAvailable] = useState<IChapter | null>(null);
    let [loadingChapterStats, setLoadingChapterStats] = useState<boolean>(true);
    let [settingThreshold, setSettingThreshold] = useState<boolean>(false);
    const invalidTargets = ["input", "textarea", "button", "select", "a"];
    useEffect(() => {
        MangaFunctions.GetMangaById(apiUri, mangaId).then(setManga);
        MangaFunctions.GetLatestChapterDownloaded(apiUri, mangaId)
            .then(setLatestChapterDownloaded)
            .finally(() => {
                if(latestChapterDownloaded && latestChapterAvailable)
                    setLoadingChapterStats(false);
            });
        MangaFunctions.GetLatestChapterAvailable(apiUri, mangaId)
            .then(setLatestChapterAvailable)
            .finally(() => {
                if(latestChapterDownloaded && latestChapterAvailable)
                    setLoadingChapterStats(false);
            });
    }, []);

    return (<div className="MangaItem" key={mangaId} is-clicked={clicked ? "clicked" : "not-clicked"} onClick={(e)=> {
        e.preventDefault();
        const target = e.target as HTMLElement;
        if(invalidTargets.find(x => x == target.localName) === undefined )
            setClicked(!clicked)
    }}>
        <img className="MangaItem-Cover" src="../../media/blahaj.png" alt="MangaFunctions Cover" onLoad={LoadMangaCover} onResize={LoadMangaCover}></img>
        <div className="MangaItem-Connector">{manga ? manga.mangaConnectorId : "Connector"}</div>
        <div className="MangaItem-Status" release-status={manga?.releaseStatus}></div>
        <div className="MangaItem-Name">{manga ? manga.name : "Name"}</div>
        <a className="MangaItem-Website" href={manga ? manga.websiteUrl : "#"}><img src="../../media/link.svg" alt="Link"/></a>
        <div className="MangaItem-Tags">
            {manga ? manga.authorIds.map(authorId =>
                <div className="MangaItem-Author" key={authorId} >
                    <Icon path={mdiAccountEdit} size={0.5} />
                    <AuthorElement apiUri={apiUri} authorId={authorId}></AuthorElement>
                </div>)
                :
                <div className="MangaItem-Author" key="null-Author">
                    <Icon path={mdiAccountEdit} size={0.5} />
                    <AuthorElement apiUri={apiUri} authorId={null}></AuthorElement>
                </div>}
            {manga ? manga.tags.map(tag =>
                <div className="MangaItem-Tag" key={tag}>
                    <Icon path={mdiTagTextOutline} size={0.5}/>
                    <span className="MangaItem-Tag-Value">{tag}</span>
                </div>)
                :
                <div className="MangaItem-Tag" key="null-Tag">
                    <Icon path={mdiTagTextOutline} size={0.5}/>
                    <span className="MangaItem-Tag-Value">Tag</span>
                </div>
            }
            {manga ? manga.linkIds.map(linkId =>
                <div className="MangaItem-Link" key={linkId}>
                    <Icon path={mdiLinkVariant} size={0.5}/>
                    <LinkElement apiUri={apiUri} linkId={linkId} />
                </div>)
                :
                <div className="MangaItem-Link" key="null-Link">
                    <Icon path={mdiLinkVariant} size={0.5}/>
                    <LinkElement apiUri={apiUri} linkId={null} />
                </div>}
        </div>
        <MarkdownPreview className="MangaItem-Description" source={manga ? manga.description : "# Description"} />
        <div className="MangaItem-Props">
            <div className="MangaItem-Props-Threshold">
                Start at Chapter
                <input type="text" defaultValue={latestChapterDownloaded ? latestChapterDownloaded.chapterNumber : ""} disabled={settingThreshold} onChange={(e) => {
                    setSettingThreshold(true);
                    MangaFunctions.SetIgnoreThreshold(apiUri, mangaId, e.currentTarget.valueAsNumber).finally(()=>setSettingThreshold(false));
                }} />
                <Loader loading={settingThreshold} />
                out of <span className="MangaItem-Props-Threshold-Available">{latestChapterAvailable ? latestChapterAvailable.chapterNumber : <Loader loading={loadingChapterStats}/>}</span>
            </div>
            {children ? children.map(c => {
                if(c instanceof Element)
                    return c as ReactElement;
                else
                    return c
            }) : null}
        </div>
    </div>)
}