import IJob from "./IJob";

export default interface IMoveMangaLibraryJob extends IJob {
    MangaId: string;
    ToLibraryId: string;
}