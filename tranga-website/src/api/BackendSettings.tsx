import {deleteData, getData, patchData, postData} from './fetchApi.tsx';
import IBackendSettings from "./types/IBackendSettings.ts";
import IRequestLimits from "./types/IRequestLimits.ts";
import {RequestLimitType} from "./types/EnumRequestLimitType.ts";

export const GetSettings = async (apiUri: string) : Promise<IBackendSettings> => {
    return await getData(`${apiUri}/v2/Settings`) as Promise<IBackendSettings>;
}

export const GetUserAgent = async (apiUri: string) : Promise<string> => {
    return await getData(`${apiUri}/v2/Settings/UserAgent`) as Promise<string>;
}

export const UpdateUserAgent = async (apiUri: string, userAgent: string)=>  {
    if(userAgent === undefined || userAgent === null)
        return Promise.reject(`userAgent was not provided`);
    return patchData(`${apiUri}/v2/Settings/UserAgent`, userAgent);
}

export const ResetUserAgent = async (apiUri: string) => {
    return deleteData(`${apiUri}/v2/Settings/UserAgent`);
}

export const GetRequestLimits = async(apiUri: string) : Promise<IRequestLimits> => {
    return await getData(`${apiUri}/v2/Settings/RequestLimits`) as Promise<IRequestLimits>;
}

export const ResetRequestLimits = async (apiUri: string) => {
    return deleteData(`${apiUri}/v2/Settings/RequestLimits`);
}

export const UpdateRequestLimit = async (apiUri: string, requestType: RequestLimitType, value: number) => {
    if(requestType === undefined || requestType === null || value === undefined || value === null)
        return Promise.reject();
    return patchData(`${apiUri}/v2/Settings/RequestLimits/${requestType}`, value);
}

export const ResetRequestLimit = async (apiUri: string, requestType: RequestLimitType) => {
    if(requestType === undefined || requestType === null)
        return Promise.reject("requestType was not provided");
    return deleteData(`${apiUri}/v2/Settings/RequestLimits/${requestType}`);
}

export const GetImageCompressionValue = async (apiUri: string) : Promise<number> => {
    return await getData(`${apiUri}/v2/Settings/ImageCompression`) as Promise<number>;
}

export const UpdateImageCompressionValue = async (apiUri: string, value: number) => {
    if(value === undefined || value === null)
        return Promise.reject("value was not provided");
    return patchData(`${apiUri}/v2/Settings/ImageCompression`, value);
}

export const GetBWImageToggle = async (apiUri: string) : Promise<boolean> => {
    return await getData(`${apiUri}/v2/Settings/BWImages`) as Promise<boolean>;
}

export const UpdateBWImageToggle = async (apiUri: string, value: boolean) => {
    if(value === undefined || value === null)
        return Promise.reject("value was not provided");
    return patchData(`${apiUri}/v2/Settings/BWImages`, value);
}

export const GetAprilFoolsToggle = async (apiUri: string) : Promise<boolean> => {
    return await getData(`${apiUri}/v2/Settings/AprilFoolsMode`) as Promise<boolean>;
}

export const UpdateAprilFoolsToggle = async (apiUri: string, value: boolean) => {
    if(value === undefined || value === null)
        return Promise.reject("value was not provided");
    return patchData(`${apiUri}/v2/Settings/AprilFoolsMode`, value);
}

export const GetChapterNamingScheme = async (apiUri: string) : Promise<string> => {
    return await getData(`${apiUri}/v2/Settings/ChapterNamingScheme`) as Promise<string>;
}

export const UpdateChapterNamingScheme = async (apiUri: string, value: string) => {
    return patchData(`${apiUri}/v2/Settings/ChapterNamingScheme`, value);
}

export const SetFlareSolverrUrl = async (apiUri: string, value: string) => {
    return postData(`${apiUri}/v2/Settings/FlareSolverr/Url`, value);
}

export const ResetFlareSolverrUrl = async (apiUri: string) => {
    return deleteData(`${apiUri}/v2/Settings/FlareSolverr/Url`);
}

export const TestFlareSolverrUrl = async (apiUri: string) => {
    return postData(`${apiUri}/v2/Settings/FlareSolverr/Test`);
}