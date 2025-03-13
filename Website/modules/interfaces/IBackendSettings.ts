export default interface IBackendSettings {
    "downloadLocation": string;
    "userAgent": string;
    "aprilFoolsMode": boolean;
    "compression": number;
    "bwImages": boolean;
    "requestLimits": {
        "MangaInfo": number;
        "MangaDexFeed": number;
        "MangaDexImage": number;
        "MangaImage": number;
        "MangaCover": number;
        "Default": number
    }
}