import {ReactElement, useState} from "react";
import INewLibraryRecord, {Validate} from "../types/records/INewLibraryRecord";
import Loader from "../Loader";
import LocalLibrary from "../api/LocalLibrary";
import "../../styles/localLibrary.css";
import ILocalLibrary from "../types/ILocalLibrary";

export default function LocalLibraryItem({apiUri, library} : {apiUri: string, library: ILocalLibrary | null}) : ReactElement {
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
                LocalLibrary.UpdateLibrary(apiUri, library.localLibraryId, record)
                    .finally(() => setLoading(false));
            }}>Edit</button>
        : <button className="LocalLibraryFunctions-Action" onClick={() => {
                if(record === null || Validate(record) === false)
                    return;
                setLoading(true);
                LocalLibrary.CreateLibrary(apiUri, record)
                    .finally(() => setLoading(false));
            }}>Add</button>
        }
        <Loader loading={loading} style={{width:"40px",height:"40px"}}/>
    </div>);
}