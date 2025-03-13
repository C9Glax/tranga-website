export default interface ICoverFormatRequestRecord {
    size: Size;
}

export interface Size {
    width: number;
    height: number;
    isEmpty: boolean;
}