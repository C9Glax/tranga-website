export default interface INewLibraryRecord {
    path: string;
    name: string;
}

export function Validate(record: INewLibraryRecord) : boolean {
    if(record.path.length < 1)
        return false;
    if(record.name.length < 1)
        return false;
    return true;
}