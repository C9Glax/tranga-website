import {LibraryType} from "./EnumLibraryType";

export default interface ILibraryConnector {
    libraryConnectorId: string;
    libraryType: LibraryType;
    baseUrl: string;
    auth: string;
}