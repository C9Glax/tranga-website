import {ReactElement} from "react";

export default interface ILocalLibrary {
    localLibraryId: string;
    basePath: string;
    libraryName: string;
}

export function LocalLibrary(library: ILocalLibrary) : ReactElement {
    return (<div key={library.localLibraryId}>
        <p className={"LocalLibraryFunctions-Name"}>{library.libraryName}</p>
        <p className={"LocalLibraryFunctions-Path"}>{library.basePath}</p>
    </div>);
}