export default interface IRequestLimits {
    Default: number;
    MangaDexFeed: number;
    MangaImage: number;
    MangaCover: number;
    MangaDexImage: number;
    MangaInfo: number;
}

export enum RequestType {
    Default = "Default",
    MangaDexFeed = "MangaDexFeed",
    MangaImage = "MangaImage",
    MangaCover = "MangaCover",
    MangaDexImage = "MangaDexImage",
    MangaInfo = "MangaInfo"
}