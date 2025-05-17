export default interface IChapter{
    chapterId: string;
    parentMangaId: string;
    volumeNumber: number | null;
    chapterNumber: string;
    url: string;
    title: string | null;
    fileName: string | null;
    downloaded: boolean;
    fullArchiveFilePath: string;
}