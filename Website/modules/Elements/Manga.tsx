import Manga from "../api/Manga";
import React, {Children, ReactElement, ReactEventHandler, useEffect, useState} from "react";
import Icon from '@mdi/react';
import { mdiTagTextOutline, mdiAccountEdit, mdiLinkVariant } from '@mdi/js';
import MarkdownPreview from '@uiw/react-markdown-preview';
import Loader from "../Loader";
import IManga from "../types/IManga";
import IChapter from "../types/IChapter";
import AuthorElement from "./Author";
import LinkElement from "./Link";

export default function MangaItem({apiUri, mangaId, children} : {apiUri: string, mangaId: string, children?: (string | ReactElement)[]}) : ReactElement {
    const LoadMangaCover : ReactEventHandler<HTMLImageElement> = (e) => {
        if(e.currentTarget.src != Manga.GetMangaCoverImageUrl(apiUri, mangaId, e.currentTarget))
            e.currentTarget.src = Manga.GetMangaCoverImageUrl(apiUri, mangaId, e.currentTarget);
    }

    let [manga, setManga] = useState<IManga | null>(null);
    let [clicked, setClicked] = useState<boolean>(false);
    let [latestChapterDownloaded, setLatestChapterDownloaded] = useState<IChapter | null>(null);
    let [latestChapterAvailable, setLatestChapterAvailable] = useState<IChapter | null>(null);
    let [loadingChapterStats, setLoadingChapterStats] = useState<boolean>(true);
    let [settingThreshold, setSettingThreshold] = useState<boolean>(false);
    const invalidTargets = ["input", "textarea", "button", "select", "a"];
    useEffect(() => {
        Manga.GetMangaById(apiUri, mangaId).then(setManga);
        Manga.GetLatestChapterDownloaded(apiUri, mangaId)
            .then(setLatestChapterDownloaded)
            .finally(() => {
                if(latestChapterDownloaded && latestChapterAvailable)
                    setLoadingChapterStats(false);
            });
        Manga.GetLatestChapterAvailable(apiUri, mangaId)
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
        <img className="MangaItem-Cover" src="../../media/blahaj.png" alt="Manga Cover" onLoad={LoadMangaCover} onResize={LoadMangaCover}></img>
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
                <div className="MangaItem-Author" key="null-AuthorTag">
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
                    Manga.SetIgnoreThreshold(apiUri, mangaId, e.currentTarget.valueAsNumber).finally(()=>setSettingThreshold(false));
                }} />
                <Loader loading={settingThreshold} style={{margin: "-10px -45px"}}/>
                out of <span className="MangaItem-Props-Threshold-Available">{latestChapterAvailable ? latestChapterAvailable.chapterNumber : <Loader loading={loadingChapterStats} style={{margin: "-10px -35px"}} />}</span>
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