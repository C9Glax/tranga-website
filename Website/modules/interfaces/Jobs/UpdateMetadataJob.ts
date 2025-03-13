import IJob from "./IJob";

export default interface UpdateMetadataJob extends IJob {
    mangaId: string;
}