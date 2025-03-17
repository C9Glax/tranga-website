import MangaFunctions from "../MangaFunctions";
import React, {Children, ReactElement, ReactEventHandler, useEffect, useState} from "react";
import Icon from '@mdi/react';
import { mdiTagTextOutline, mdiAccountEdit, mdiLinkVariant } from '@mdi/js';
import MarkdownPreview from '@uiw/react-markdown-preview';
import {AuthorElement} from "./IAuthor";
import {LinkElement} from "./ILink";

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
    useEffect(() => {
        MangaFunctions.GetMangaById(apiUri, mangaId).then(setManga);
    }, []);

    return (<div className="MangaItem" key={mangaId} is-clicked={clicked ? "clicked" : "not-clicked"} onClick={()=>setClicked(!clicked)}>
        <img className="MangaItem-Cover" src={MangaFunctions.GetMangaCoverImageUrl(apiUri, mangaId, undefined)} alt="MangaFunctions Cover" onLoad={LoadMangaCover} onResize={LoadMangaCover}></img>
        <p className="MangaItem-Connector">{manga ? manga.mangaConnectorId : "Connector"}</p>
        <p className="MangaItem-Status" release-status={manga?.releaseStatus}></p>
        <p className="MangaItem-Name">{manga ? manga.name : "Name"}</p>
        <a className="MangaItem-Website" href={manga ? manga.websiteUrl : "#"}><img src="../../media/link.svg" alt="Link"/></a>
        <div className="MangaItem-Tags">
            {manga ? manga.authorIds.map(authorId =>
                <p className="MangaItem-Author" key={authorId} >
                    <Icon path={mdiAccountEdit} size={0.5} />
                    <AuthorElement apiUri={apiUri} authorId={authorId}></AuthorElement>
                </p>)
                :
                <p className="MangaItem-Author">
                    <Icon path={mdiAccountEdit} size={0.5} />
                    <AuthorElement apiUri={apiUri} authorId={null}></AuthorElement>
                </p>}
            {manga ? manga.tags.map(tag =>
                <p className="MangaItem-Tag" key={tag}>
                    <Icon path={mdiTagTextOutline} size={0.5}/>
                    <p className="MangaItem-Tag-Value">{tag}</p>
                </p>)
                :
                <p className="MangaItem-Tag">
                    <Icon path={mdiTagTextOutline} size={0.5}/>
                    <p className="MangaItem-Tag-Value">Tag</p>
                </p>
            }
            {manga ? manga.linkIds.map(linkId =>
                <p className="MangaItem-Link" key={linkId}>
                    <Icon path={mdiLinkVariant} size={0.5}/>
                    <LinkElement apiUri={apiUri} linkId={linkId} />
                </p>)
                :
                <p className="MangaItem-Link">
                    <Icon path={mdiLinkVariant} size={0.5}/>
                    <LinkElement apiUri={apiUri} linkId={null} />
                </p>}
        </div>
        <MarkdownPreview className="MangaItem-Description" source={manga ? manga.description : "# Description"} />
        <div className="MangaItem-Props">
            {children ? children.map(c => {
                if(c instanceof Element)
                    return c as ReactElement;
                else
                    return <span>{c}</span>
            }) : null}
        </div>
    </div>)
}