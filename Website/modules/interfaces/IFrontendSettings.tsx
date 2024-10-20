import {Cookies} from "react-cookie";

export default interface IFrontendSettings {
    jobInterval: Date;
    apiUri: string;
}

export function FrontendSettingsWith(settings: IFrontendSettings | undefined, jobInterval: Date | undefined, apiUri: string | undefined): IFrontendSettings {
    const cookies = new Cookies();
    let transform : IFrontendSettings;
    if(settings === undefined) {
        transform = {
            apiUri: apiUri === undefined
                ? cookies.get('apiUri') === undefined
                    ? `${window.location.protocol}//${window.location.host}/api`
                    : cookies.get('apiUri')
                : apiUri,
            jobInterval: jobInterval === undefined
                ? cookies.get('jobInterval') === undefined
                    ? new Date(0,0,0,3)
                    : cookies.get('jobInterval')
                : jobInterval
        }
    }else {
        transform = {
            apiUri: apiUri === undefined ? settings.apiUri : apiUri,
            jobInterval: jobInterval === undefined ? settings.jobInterval : jobInterval,
        }
    }
    console.debug(settings);
    console.debug(transform);
    return transform;
}