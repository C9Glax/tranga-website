import {MangaReleaseStatus} from "./EnumMangaReleaseStatus";
import IAuthor from "./IAuthor.ts";
import IMangaAltTitle from "./IMangaAltTitle.ts";
import IMangaTag from "./IMangaTag.ts";
import ILink from "./ILink.ts";

export default interface IManga{
    mangaId: string;
    idOnConnectorSite: string;
    name: string;
    description: string;
    websiteUrl: string;
    releaseStatus: MangaReleaseStatus;
    libraryId: string | null;
    mangaConnectorName: string;
    authors: IAuthor[] | null;
    mangaTags: IMangaTag[] | null;
    links: ILink[] | null;
    altTitles: IMangaAltTitle[] | null;
    ignoreChaptersBefore: number;
    directoryName: string;
    year: number | null;
    originalLanguage: string | null;
    chapterIds: string[] | null;
}

export const DefaultManga : IManga = {
    mangaId: "Loading",
    idOnConnectorSite: "Loading",
    name: "Loading",
    description: "Loading",
    websiteUrl: "",
    releaseStatus: MangaReleaseStatus.Continuing,
    libraryId: null,
    mangaConnectorName: "Loading",
    authors: null,
    mangaTags: null,
    links: null,
    altTitles: null,
    ignoreChaptersBefore: 0,
    directoryName: "",
    year: 1999,
    originalLanguage: "en",
    chapterIds: null
}