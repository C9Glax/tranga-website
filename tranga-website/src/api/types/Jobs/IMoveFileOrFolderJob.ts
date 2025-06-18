import IJob from "./IJob";

export default interface IMoveFileOrFolderJob extends IJob {
    fromLocation: string;
    toLocation: string;
}