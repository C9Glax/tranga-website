import React, {ReactElement, ReactEventHandler, useEffect, useState} from "react";
import Manga from "../Manga";
import IManga from "./IManga";
import Chapter from "../Chapter";

export default interface IChapter{
    chapterId: string;
    volumeNumber: number;
    chapterNumber: string;
    url: string;
    title: string | undefined;
    archiveFileName: string;
    downloaded: boolean;
    parentMangaId: string;
}

export function ChapterItem({apiUri, chapterId} : {apiUri: string, chapterId: string}) : ReactElement {
    const setCoverItem : ReactEventHandler<HTMLImageElement> = (e) => {
        setMangaCoverHtmlImageItem(e.currentTarget);
    }

    let [chapter, setChapter] = useState<IChapter | null>(null);
    let [manga, setManga] = useState<IManga | null>(null);
    let [mangaCoverUrl, setMangaCoverUrl] = useState<string>("../../media/blahaj.png");
    let [mangaCoverHtmlImageItem, setMangaCoverHtmlImageItem] = useState<HTMLImageElement | null>(null);
    useEffect(() => {
        Chapter.GetChapterFromId(apiUri, chapterId).then(setChapter);
    }, []);
    useEffect(() => {
        if(chapter === null)
            manga = null;
        else
            Manga.GetMangaById(apiUri, chapter.parentMangaId).then(setManga);
    }, [chapter]);
    useEffect(() => {
        if(chapter != null && mangaCoverHtmlImageItem != null)
            setMangaCoverUrl(Manga.GetMangaCoverImageUrl(apiUri, chapter.parentMangaId, mangaCoverHtmlImageItem));
    }, [chapter, mangaCoverHtmlImageItem]);

    return (<div className="ChapterItem" key={chapterId}>
        <img className="ChapterItem-Cover" src={mangaCoverUrl} alt="Manga Cover" onLoad={setCoverItem} onResize={setCoverItem}></img>
        <p className="ChapterItem-MangaName">{manga ? manga.name : "Manga-Name"}</p>
        <p className="ChapterItem-ChapterName">{chapter ? chapter.title : "Chapter-Title"}</p>
        <p className="ChapterItem-Volume">Vol.{chapter ? chapter.volumeNumber : "VolNum"}</p>
        <p className="ChapterItem-Chapter">Ch.{chapter ? chapter.chapterNumber : "ChNum"}</p>
        <a className="ChapterItem-Website" href={chapter ? chapter.url : "#"}><img src="../../media/link.svg" alt="Link"/></a>
    </div>)
}