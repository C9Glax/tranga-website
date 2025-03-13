export default interface ILibraryConnector {
    libraryConnectorId: string;
    libraryType: LibraryType;
    baseUrl: string;
    auth: string;
}

export enum LibraryType {
    Komga = "Komga",
    Kavita = "Kavita"
}