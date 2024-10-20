export default interface IBackendSettings {
    "downloadLocation": string;
    "workingDirectory": string;
    "apiPortNumber": number;
    "userAgent": string;
    "bufferLibraryUpdates": boolean;
    "bufferNotifications": boolean;
    "version": number;
    "aprilFoolsMode": boolean;
    "requestLimits": {
        "MangaInfo": number;
        "MangaDexFeed": number;
        "MangaDexImage": number;
        "MangaImage": number;
        "MangaCover": number;
        "Default": number
    }
}