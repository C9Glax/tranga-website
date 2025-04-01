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