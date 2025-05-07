import React, {ReactElement, ReactEventHandler, useEffect, useState} from "react";
import Manga from "../api/Manga";
import Chapter from "../api/Chapter";
import IChapter from "../types/IChapter";
import IManga from "../types/IManga";

export default function ChapterItem({apiUri, chapterId} : {apiUri: string, chapterId: string}) : ReactElement {
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

    let [clicked, setClicked] = useState<boolean>(false);

    return (<div className="ChapterItem" key={chapterId} is-clicked={clicked ? "clicked" : "not-clicked"} onClick={() => setClicked(!clicked)}>
        <img className="ChapterItem-Cover" src={mangaCoverUrl} alt="Manga Cover" onLoad={setCoverItem} onResize={setCoverItem}></img>
        <p className="ChapterItem-MangaName">{manga ? manga.name : "Manga-Name"}</p>
        <p className="ChapterItem-ChapterName">{chapter ? chapter.title : "Chapter-Title"}</p>
        <p className="ChapterItem-Volume">Vol.{chapter ? chapter.volumeNumber : "VolNum"}</p>
        <p className="ChapterItem-Chapter">Ch.{chapter ? chapter.chapterNumber : "ChNum"}</p>
        <p className="ChapterItem-VolumeChapter">Vol.{chapter ? chapter.volumeNumber : "VolNum"} Ch.{chapter ? chapter.chapterNumber : "ChNum"}</p>
        <a className="ChapterItem-Website" href={chapter ? chapter.url : "#"}><img src="../../media/link.svg" alt="Link"/></a>
    </div>)
}