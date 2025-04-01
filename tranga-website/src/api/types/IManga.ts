import {MangaReleaseStatus} from "./EnumMangaReleaseStatus";

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

export const DefaultManga : IManga = {
    mangaId: "MangaId",
    idOnConnectorSite: "ID",
    name: "TestManga",
    description: "Wow so much text, very cool",
    websiteUrl: "https://realsite.realdomain",
    year: 1999,
    originalLanguage: "lindtChoccy",
    releaseStatus: MangaReleaseStatus.Continuing,
    folderName: "uhhh",
    ignoreChapterBefore: 0,
    mangaConnectorId: "MangaDex",
    authorIds: ["We got", "Authors"],
    tags: ["And we", "got Tags"],
    linkIds: ["And most", "definitely", "links"],
    altTitleIds: ["But not alt-titles."],
}