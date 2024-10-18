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

function ReleaseStatusFromNumber(n: number): string {
    switch(n) {
        case 0: return "Ongoing";
        case 1: return "Completed";
        case 2: return "OnHiatus";
        case 3: return "Cancelled";
        case 4: return "Unreleased";
    }
    return "";
}

export function HTMLFromIManga(manga: IManga) : ReactElement {
    return(
    <div className="Manga" key={manga.internalId}>
        <img src={Manga.GetMangaCoverUrl(manga.internalId)}></img>
        <div>
            <p className="Manga-name">{manga.sortName}</p>
            <p className="pill connector-name">{manga.mangaConnector.name}</p>
            <div className="Manga-status" release-status={ReleaseStatusFromNumber(manga.releaseStatus)}></div>
        </div>
    </div>);
}