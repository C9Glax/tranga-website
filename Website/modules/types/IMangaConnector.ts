export default interface IMangaConnector {
    name: string;
    supportedLanguages: string[];
    iconUrl: string;
    baseUris: string[];
    enabled: boolean;
}