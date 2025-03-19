import {ReactElement, useState} from "react";
import INewLibraryRecord, {Validate} from "./records/INewLibraryRecord";
import Loader from "../Loader";
import LocalLibraryFunctions from "../LocalLibraryFunctions";
import "../../styles/localLibrary.css";

export default interface ILocalLibrary {
    localLibraryId: string;
    basePath: string;
    libraryName: string;
}

export function LocalLibraryItem({apiUri, library} : {apiUri: string, library: ILocalLibrary | null}) : ReactElement {
    const [loading, setLoading] = useState<boolean>(false);
    const [record, setRecord] = useState<INewLibraryRecord>({
       path: library?.basePath ?? "",
       name: library?.libraryName ?? ""
    });

    return (<div className="LocalLibraryFunctions">
        <label htmlFor="LocalLibraryFunctions-Name">Library Name</label>
        <input id="LocalLibraryFunctions-Name" className="LocalLibraryFunctions-Name" placeholder="Library Name" defaultValue={library ? library.libraryName : "New Library"}
               onChange={(e) => setRecord({...record, name: e.currentTarget.value})}/>
        <label htmlFor="LocalLibraryFunctions-Path">Library Path</label>
        <input id="LocalLibraryFunctions-Path" className="LocalLibraryFunctions-Path" placeholder="Library Path" defaultValue={library ? library.basePath : ""}
               onChange={(e) => setRecord({...record, path: e.currentTarget.value})}/>
        {library
        ? <button className="LocalLibraryFunctions-Action" onClick={() => {
                if(record === null || Validate(record) === false)
                    return;
                setLoading(true);
                LocalLibraryFunctions.UpdateLibrary(apiUri, library.localLibraryId, record)
                    .finally(() => setLoading(false));
            }}>Edit</button>
        : <button className="LocalLibraryFunctions-Action" onClick={() => {
                if(record === null || Validate(record) === false)
                    return;
                setLoading(true);
                LocalLibraryFunctions.CreateLibrary(apiUri, record)
                    .finally(() => setLoading(false));
            }}>Add</button>
        }
        <Loader loading={loading} style={{width:"40px",height:"40px"}}/>
    </div>);
}