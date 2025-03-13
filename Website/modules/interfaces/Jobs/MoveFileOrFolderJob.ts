import IJob from "./IJob";

export default interface MoveFileOrFolderJob extends IJob {
    fromLocation: string;
    toLocation: string;
}