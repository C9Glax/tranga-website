import {deleteData, getData, patchData} from "../../App";
import IRequestLimits from "../types/IRequestLimits";
import IBackendSettings from "../types/IBackendSettings";
import {RequestLimitType} from "../types/EnumRequestLimitType";

export default class BackendSettings {
    static async GetSettings(apiUri: string) : Promise<IBackendSettings> {
        return getData(`${apiUri}/v2/Settings`).then((s) => s as IBackendSettings);
    }

    static async GetUserAgent(apiUri: string) : Promise<string> {
        return getData(`${apiUri}/v2/Settings/UserAgent`).then((text) => text as unknown as string);
    }

    static async UpdateUserAgent(apiUri: string, userAgent: string) {
        return patchData(`${apiUri}/v2/Settings/UserAgent`, userAgent);
    }

    static async ResetUserAgent(apiUri: string) {
        return deleteData(`${apiUri}/v2/Settings/UserAgent`);
    }

    static async GetRequestLimits(apiUri: string) : Promise<IRequestLimits> {
        return getData(`${apiUri}/v2/Settings/RequestLimits`).then((limits) => limits as IRequestLimits);
    }

    static async ResetRequestLimits(apiUri: string) {
        return deleteData(`${apiUri}/v2/Settings/RequestLimits`);
    }

    static async UpdateRequestLimit(apiUri: string, requestType: RequestLimitType, value: number) {
        return patchData(`${apiUri}/v2/Settings/RequestLimits/${requestType}`, value);
    }

    static async ResetRequestLimit(apiUri: string, requestType: RequestLimitType) {
        return deleteData(`${apiUri}/v2/Settings/RequestLimits/${requestType}`);
    }

    static async GetImageCompressionValue(apiUri: string) : Promise<number> {
        return getData(`${apiUri}/v2/Settings/ImageCompression`).then((n) => n as unknown as number);
    }

    static async UpdateImageCompressionValue(apiUri: string, value: number) {
        return patchData(`${apiUri}/v2/Settings/ImageCompression`, value);
    }

    static async GetBWImageToggle(apiUri: string) : Promise<boolean> {
        return getData(`${apiUri}/v2/Settings/BWImages`).then((state) => state as unknown as boolean);
    }

    static async UpdateBWImageToggle(apiUri: string, value: boolean) {
        return patchData(`${apiUri}/v2/Settings/BWImages`, value);
    }

    static async GetAprilFoolsToggle(apiUri: string) : Promise<boolean> {
        return getData(`${apiUri}/v2/Settings/AprilFoolsMode`).then((state) => state as unknown as boolean);
    }

    static async UpdateAprilFoolsToggle(apiUri: string, value: boolean) {
        return patchData(`${apiUri}/v2/Settings/AprilFoolsMode`, value);
    }

    static async GetChapterNamingScheme(apiUri: string) : Promise<string> {
        return getData(`${apiUri}/v2/Settings/ChapterNamingScheme`).then((state) => state as unknown as string);
    }

    static async UpdateChapterNamingScheme(apiUri: string, value: string) {
        return patchData(`${apiUri}/v2/Settings/ChapterNamingScheme`, value);
    }
}