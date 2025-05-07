import IJob from "./IJob";

export default interface IRetrieveChaptersJob extends IJob {
    mangaId: string;
}