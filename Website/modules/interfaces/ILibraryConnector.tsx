export default interface ILibraryConnector {
    libraryType: number;
    baseUrl: string;
    auth: string;
}

export function GetLibraryConnectorNameFromNumber(n: number): string {
    switch(n){
        case 0: return "Komga";
        case 1: return "Kavita";
    }
    return "";
}