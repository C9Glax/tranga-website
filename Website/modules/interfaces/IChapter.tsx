import IManga from "./IManga";

export default interface IChapter{
    parentManga: IManga;
    name: string | undefined;
    volumeNumber: string;
    chapterNumber: string;
    url: string;
    fileName: string;
}