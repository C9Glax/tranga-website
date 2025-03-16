import {ReactElement} from "react";

export default interface ILocalLibrary {
    localLibraryId: string;
    basePath: string;
    libraryName: string;
}

export function LocalLibrary(library: ILocalLibrary) : ReactElement {
    return (<div key={library.localLibraryId}>
        <p className={"LocalLibrary-Name"}>{library.libraryName}</p>
        <p className={"LocalLibrary-Path"}>{library.basePath}</p>
    </div>);
}