import IFrontendSettings from "./interfaces/IFrontendSettings";
import '../styles/settings.css';
import '../styles/react-toggle.css';
import React, {useEffect, useRef, useState} from "react";
import INotificationConnector, {NotificationConnectorItem} from "./interfaces/INotificationConnector";
import NotificationConnectorFunctions from "./NotificationConnectorFunctions";
import ILocalLibrary, {LocalLibraryItem} from "./interfaces/ILocalLibrary";
import LocalLibraryFunctions from "./LocalLibraryFunctions";
import IBackendSettings from "./interfaces/IBackendSettings";
import BackendSettings from "./BackendSettingsFunctions";
import Toggle from "react-toggle";
import Loader from "./Loader";
import {RequestType} from "./interfaces/IRequestLimits";
import IMangaConnector from "./interfaces/IMangaConnector";
import {MangaConnectorFunctions} from "./MangaConnectorFunctions";

export default function Settings({ backendConnected, apiUri, frontendSettings, setFrontendSettings } : {
    backendConnected: boolean,
    apiUri: string,
    frontendSettings: IFrontendSettings,
    setFrontendSettings: (settings: IFrontendSettings) => void
}) {
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [loadingBackend, setLoadingBackend] = useState(false);
    const [backendSettings, setBackendSettings] = useState<IBackendSettings|null>(null);
    const [notificationConnectors, setNotificationConnectors] = useState<INotificationConnector[]>([]);
    const [mangaConnectors,setMangaConnectors] = useState<IMangaConnector[]>([]);
    const [localLibraries, setLocalLibraries] = useState<ILocalLibrary[]>([]);

    useEffect(() => {
        if(!backendConnected)
            return;
        NotificationConnectorFunctions.GetNotificationConnectors(apiUri).then(setNotificationConnectors);
        LocalLibraryFunctions.GetLibraries(apiUri).then(setLocalLibraries);
        BackendSettings.GetSettings(apiUri).then(setBackendSettings);
        MangaConnectorFunctions.GetAllConnectors(apiUri).then(setMangaConnectors);
    }, [backendConnected, showSettings]);

    const dateToStr = (x: Date) => {
        const ret = (x.getHours() < 10 ? "0" + x.getHours() : x.getHours())
            + ":" +
            (x.getMinutes() < 10 ? "0" + x.getMinutes() : x.getMinutes());
        return ret;
    }

    const ChangeRequestLimit = (requestType: RequestType, limit: number) => {
        if(backendSettings === null)
            return;
        setLoadingBackend(true);
        BackendSettings.UpdateRequestLimit(apiUri, requestType, limit)
            .then(() => setBackendSettings({...backendSettings, [requestType]: requestType}))
            .finally(() => setLoadingBackend(false));
    }
    const ref : React.LegacyRef<HTMLInputElement> | undefined = useRef<HTMLInputElement>(null);

    return (
        <div id="Settings">
            <div onClick={() => setShowSettings(true)}>
                <img id="Settings-Cogwheel" src="../../media/settings-cogwheel.svg" alt="settings-cogwheel" />
            </div>
            {showSettings
                ? <div className="popup" id="SettingsPopUp">
                    <div className="popupHeader">
                        <h1>Settings</h1>
                        <img alt="Close Settings" className="close" src="../media/close-x.svg" onClick={() => setShowSettings(false)}/>
                    </div>
                    <div id="SettingsPopUpBody" className="popupBody">
                        <Loader loading={loadingBackend} style={{width: "64px", height: "64px", margin: "25vh calc(sin(70)*(50% - 40px))", zIndex: 100, padding: 0, borderRadius: "50%", border: 0, minWidth: "initial", maxWidth: "initial"}}/>
                        <div className="settings-apiuri">
                            <h3>ApiUri</h3>
                            <input type="url" defaultValue={frontendSettings.apiUri} onChange={(e) => setFrontendSettings({...frontendSettings, apiUri:e.currentTarget.value})} id="ApiUri" />
                        </div>
                        <div className="settings-jobinterval">
                            <h3>Default Job-Interval</h3>
                            <input type="time" min="00:30" max="23:59" defaultValue={dateToStr(new Date(frontendSettings.jobInterval))} onChange={(e) => setFrontendSettings({...frontendSettings, jobInterval: new Date(e.currentTarget.valueAsNumber-60*60*1000) ?? frontendSettings.jobInterval})}/>
                        </div>
                        <div className="settings-bwimages">
                            <h3>B/W Images</h3>
                            <Toggle defaultChecked={backendSettings ? backendSettings.bwImages : false} disabled={backendSettings ? false : !loadingBackend}
                                    onChange={(e) => {
                                        if(backendSettings === null)
                                            return;
                                        setLoadingBackend(true);
                                        BackendSettings.UpdateBWImageToggle(apiUri, e.target.checked)
                                            .then(() => setBackendSettings({...backendSettings, bwImages: e.target.checked}))
                                            .finally(() => setLoadingBackend(false));
                                    }} />
                        </div>
                        <div className="settings-aprilfools">
                            <h3>April Fools Mode</h3>
                            <Toggle defaultChecked={backendSettings ? backendSettings.aprilFoolsMode : false} disabled={backendSettings ? false : !loadingBackend}
                                    onChange={(e) => {
                                        if(backendSettings === null)
                                            return;
                                        setLoadingBackend(true);
                                        BackendSettings.UpdateAprilFoolsToggle(apiUri, e.target.checked)
                                            .then(() => setBackendSettings({...backendSettings, aprilFoolsMode: e.target.checked}))
                                            .finally(() => setLoadingBackend(false));
                                    }} />
                        </div>
                        <div className="settings-imagecompression">
                            <h3>Image Compression</h3>
                            <Toggle defaultChecked={backendSettings ? backendSettings.compression < 100 : false} disabled={backendSettings ? false : !loadingBackend}
                                    onChange={(e) => {
                                        if(backendSettings === null)
                                            return;
                                        setLoadingBackend(true);
                                        BackendSettings.UpdateImageCompressionValue(apiUri, e.target.checked ? 40 : 100)
                                            .then(() => setBackendSettings({...backendSettings, compression: e.target.checked ? 40 : 100}))
                                            .then(() => {
                                                if(ref.current != null){
                                                    ref.current.value = e.target.checked ? "40" : "100";
                                                    ref.current.disabled = !e.target.checked;
                                                }
                                            })
                                            .finally(() => setLoadingBackend(false));
                                    }} />
                            <input ref={ref} type="number" min={0} max={100} defaultValue={backendSettings ? backendSettings.compression : 0} disabled={backendSettings ? false : !loadingBackend}
                                   onChange={(e) => {
                                       if(backendSettings === null)
                                           return;
                                       setLoadingBackend(true);
                                       BackendSettings.UpdateImageCompressionValue(apiUri, e.currentTarget.valueAsNumber)
                                           .then(() => setBackendSettings({...backendSettings, compression: e.currentTarget.valueAsNumber}))
                                           .finally(() => setLoadingBackend(false));
                                   }} />
                        </div>
                        <div className="settings-useragent">
                            <h3>User Agent</h3>
                            <input type="text" defaultValue={backendSettings ? backendSettings.userAgent : ""}
                                   onChange={(e) => {
                                       if(backendSettings === null)
                                           return;
                                       setLoadingBackend(true);
                                       BackendSettings.UpdateUserAgent(apiUri, e.currentTarget.value)
                                           .then(() => setBackendSettings({...backendSettings, userAgent: e.currentTarget.value}))
                                           .finally(() => setLoadingBackend(false));
                                   }} />
                        </div>
                        <div className="settings-requestLimits">
                            <h3>Request Limits:</h3>
                            <label htmlFor="Default">Default</label>
                            <input id="Default" type="number" defaultValue={backendSettings ? backendSettings.requestLimits.Default : 0} disabled={backendSettings ? false : !loadingBackend}
                                onChange={(e) => ChangeRequestLimit(RequestType.Default, e.currentTarget.valueAsNumber)} />
                            <label htmlFor="MangaInfo">MangaInfo</label>
                            <input id="MangaInfo" type="number" defaultValue={backendSettings ? backendSettings.requestLimits.MangaInfo : 0} disabled={backendSettings ? false : !loadingBackend}
                                   onChange={(e) => ChangeRequestLimit(RequestType.MangaInfo, e.currentTarget.valueAsNumber)} />
                            <label htmlFor="MangaDexFeed">MangaDexFeed</label>
                            <input id="MangaDexFeed" type="number" defaultValue={backendSettings ? backendSettings.requestLimits.MangaDexFeed : 0} disabled={backendSettings ? false : !loadingBackend}
                                   onChange={(e) => ChangeRequestLimit(RequestType.MangaDexFeed, e.currentTarget.valueAsNumber)} />
                            <label htmlFor="MangaDexImage">MangaDexImage</label>
                            <input id="MangaDexImage" type="number" defaultValue={backendSettings ? backendSettings.requestLimits.MangaDexImage : 0} disabled={backendSettings ? false : !loadingBackend}
                                   onChange={(e) => ChangeRequestLimit(RequestType.MangaDexImage, e.currentTarget.valueAsNumber)} />
                            <label htmlFor="MangaImage">MangaImage</label>
                            <input id="MangaImage" type="number" defaultValue={backendSettings ? backendSettings.requestLimits.MangaImage : 0} disabled={backendSettings ? false : !loadingBackend}
                                   onChange={(e) => ChangeRequestLimit(RequestType.MangaImage, e.currentTarget.valueAsNumber)} />
                            <label htmlFor="MangaCover">MangaCover</label>
                            <input id="MangaCover" type="number" defaultValue={backendSettings ? backendSettings.requestLimits.MangaCover : 0} disabled={backendSettings ? false : !loadingBackend}
                                   onChange={(e) => ChangeRequestLimit(RequestType.MangaCover, e.currentTarget.valueAsNumber)} />
                        </div>
                        <div className={"settings-mangaConnectors"}>
                            {mangaConnectors.map(mc => {
                                return (
                                    <div key={mc.name}>
                                        <span>{mc.name}</span>
                                        <Toggle defaultChecked={mc.enabled} onChange={(e) => {
                                                    MangaConnectorFunctions.SetConnectorEnabled(apiUri, mc.name, e.currentTarget.checked);
                                                }} />
                                    </div>);
                            })}
                        </div>
                        <div>
                            <h3>Notification Connectors:</h3>
                            {notificationConnectors.map(c => <NotificationConnectorItem apiUri={apiUri} notificationConnector={c} key={c.name} />)}
                            <NotificationConnectorItem apiUri={apiUri} notificationConnector={null} key="New Notification Connector" />
                        </div>
                        <div>
                            <h3>Local Libraries:</h3>
                            {localLibraries.map(l => <LocalLibraryItem apiUri={apiUri} library={l} key={l.localLibraryId} />)}
                            <LocalLibraryItem apiUri={apiUri} library={null} key="New Local Library" />
                        </div>
                    </div>
                </div>
                : null
            }
        </div>
    );
}