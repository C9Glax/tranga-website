import {Cookies} from "react-cookie";

export default interface IFrontendSettings {
    jobInterval: Date;
    apiUri: string;
}

export function LoadFrontendSettings(): IFrontendSettings {
    const cookies = new Cookies();
    return {
        jobInterval: cookies.get('jobInterval') === undefined
            ? new Date(0,0,0,3)
            : cookies.get('jobInterval'),
        apiUri: cookies.get('apiUri') === undefined
            ? `${window.location.protocol}//${window.location.host}/api`
            : cookies.get('apiUri')
    }
}