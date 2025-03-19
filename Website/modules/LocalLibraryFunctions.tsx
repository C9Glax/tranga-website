import ILocalLibrary from "./interfaces/ILocalLibrary";
import {deleteData, getData, patchData, putData} from "../App";
import INewLibraryRecord from "./interfaces/records/INewLibraryRecord";

export default class LocalLibraryFunctions
{
    static async GetLibraries(apiUri: string): Promise<ILocalLibrary[]> {
        return getData(`${apiUri}/v2/LocalLibraries`)
            .then((json) => {
                const ret = json as ILocalLibrary[];
                return (ret);
            });
    }

    static async GetLibrary(apiUri: string, libraryId: string): Promise<ILocalLibrary> {
        return getData(`${apiUri}/v2/LocalLibraries/${libraryId}`)
            .then((json) => {
                const ret = json as ILocalLibrary;
                //console.debug(ret);
                return (ret);
            });
    }

    static async CreateLibrary(apiUri: string, data: INewLibraryRecord): Promise<ILocalLibrary> {
        return putData(`${apiUri}/v2/LocalLibraries`, data)
            .then((json) => {
                const ret = json as ILocalLibrary;
                //console.debug(ret);
                return (ret);
            });
    }

    static async DeleteLibrary(apiUri: string, libraryId: string): Promise<void> {
        return deleteData(`${apiUri}/v2/LocalLibraries/${libraryId}`);
    }

    static async ChangeLibraryPath(apiUri: string, libraryId: string, newPath: string): Promise<void> {
        return patchData(`${apiUri}/v2/LocalLibraries/${libraryId}/ChangeBasePath`, newPath)
            .then(()=> {
                return Promise.resolve()
            });
    }

    static async ChangeLibraryName(apiUri: string, libraryId: string, newName: string): Promise<void> {
        return patchData(`${apiUri}/v2/LocalLibraries/${libraryId}/ChangeName`, newName)
            .then(()=> {
                return Promise.resolve()
            });
    }

    static async UpdateLibrary(apiUri: string, libraryId: string, record: INewLibraryRecord): Promise<void> {
        return patchData(`${apiUri}/v2/LocalLibraries/${libraryId}`, record)
            .then(()=> {
                return Promise.resolve()
            });
    }
}