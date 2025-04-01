import ILocalLibrary from "./types/ILocalLibrary.ts";
import {deleteData, getData, patchData, putData} from "./fetchApi.tsx";
import INewLibraryRecord from "./types/records/INewLibraryRecord.ts";

export const GetLibraries = async (apiUri: string) : Promise<ILocalLibrary[]> => {
    return await getData(`${apiUri}/v2/LocalLibraries`) as Promise<ILocalLibrary[]>;
}

export const  GetLibrary = async (apiUri: string, libraryId: string) : Promise<ILocalLibrary> => {
    return await getData(`${apiUri}/v2/LocalLibraries/${libraryId}`) as Promise<ILocalLibrary>;
}

export const  CreateLibrary = async (apiUri: string, data: INewLibraryRecord) : Promise<ILocalLibrary> => {
    return await putData(`${apiUri}/v2/LocalLibraries`, data) as Promise<ILocalLibrary>
}

export const  DeleteLibrary = async (apiUri: string, libraryId: string) : Promise<void> => {
    return await deleteData(`${apiUri}/v2/LocalLibraries/${libraryId}`);
}

export const  ChangeLibraryPath = async (apiUri: string, libraryId: string, newPath: string) : Promise<object> => {
    return await patchData(`${apiUri}/v2/LocalLibraries/${libraryId}/ChangeBasePath`, newPath);
}

export const  ChangeLibraryName = async (apiUri: string, libraryId: string, newName: string) : Promise<object> => {
    return await patchData(`${apiUri}/v2/LocalLibraries/${libraryId}/ChangeName`, newName);
}

export const  UpdateLibrary = async (apiUri: string, libraryId: string, record: INewLibraryRecord) : Promise<object> => {
    return await patchData(`${apiUri}/v2/LocalLibraries/${libraryId}`, record);
}