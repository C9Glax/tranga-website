import IMangaConnector from "./IMangaConnector";
import KeyValuePair from "./KeyValuePair";
import {Manga} from "../Manga";
import {ReactElement} from "react";

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

export function HTMLFromIManga(manga: IManga) : ReactElement {
    return (<div className="Manga" key={manga.internalId}>
        <p>{manga.sortName}</p>
        <p>Description: {manga.description}</p>
        <p>MangaConnector: {manga.mangaConnector.name}</p>
    </div>)
}