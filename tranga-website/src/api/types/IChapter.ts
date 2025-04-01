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