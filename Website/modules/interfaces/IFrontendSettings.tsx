import {Cookies} from "react-cookie";

export default interface IFrontendSettings {
    jobInterval: Date;
    apiUri: string;
}

export function LoadFrontendSettings(): IFrontendSettings {
    const cookies = new Cookies();
    return {
        jobInterval: cookies.get('jobInterval') === undefined
            ? new Date(Date.parse("1970-01-01T03:00:00.000Z"))
            : cookies.get('jobInterval'),
        apiUri: cookies.get('apiUri') === undefined
            ? `${window.location.protocol}//${window.location.host}/api`
            : cookies.get('apiUri')
    }
}