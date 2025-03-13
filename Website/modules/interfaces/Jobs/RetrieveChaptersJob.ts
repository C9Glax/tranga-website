import IJob from "./IJob";

export default interface RetrieveChaptersJob extends IJob {
    mangaId: string;
}