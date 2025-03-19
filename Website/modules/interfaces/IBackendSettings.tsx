export default interface IBackendSettings {
    downloadLocation: string;
    workingDirectory: string;
    userAgent: string;
    aprilFoolsMode: boolean;
    requestLimits: {
        Default: number,
        MangaInfo: number,
        MangaDexFeed: number,
        MangaDexImage: number,
        MangaImage: number,
        MangaCover: number,
    };
    compression: number;
    bwImages: boolean;
    startNewJobTimeoutMs: number;
}
