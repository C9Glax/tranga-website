import IJobWithMangaId from "./IJobWithMangaId.ts";

export default interface IMoveMangaLibraryJob extends IJobWithMangaId {
    ToLibraryId: string;
}