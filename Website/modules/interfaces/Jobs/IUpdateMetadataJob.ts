import IJob from "./IJob";

export default interface IUpdateMetadataJob extends IJob {
    mangaId: string;
}