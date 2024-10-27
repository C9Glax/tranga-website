import React, {ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useEffect, useState} from 'react';
import IFrontendSettings from "./interfaces/IFrontendSettings";
import '../styles/settings.css';
import IBackendSettings from "./interfaces/IBackendSettings";
import {getData, postData} from "../App";
import LibraryConnector, {Kavita, Komga} from "./LibraryConnector";
import NotificationConnector, {Gotify, Lunasea, Ntfy} from "./NotificationConnector";
import ILibraryConnector from "./interfaces/ILibraryConnector";
import INotificationConnector from "./interfaces/INotificationConnector";
import Toggle from 'react-toggle';
import '../styles/react-toggle.css';

export default function Settings({backendConnected, apiUri, settings, changeSettings} : {backendConnected: boolean, apiUri: string, settings: IFrontendSettings, changeSettings: (settings: IFrontendSettings) => void}) {
    const [frontendSettings, setFrontendSettings] = useState<IFrontendSettings>(settings);
    const [backendSettings, setBackendSettings] = useState<IBackendSettings>();
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [libraryConnectors, setLibraryConnectors] = useState<ILibraryConnector[]>();
    const [notificationConnectors, setNotificationConnectors] = useState<INotificationConnector[]>();
    const [komgaSettings, setKomgaSettings] = useState<{url: string, username: string, password: string}>({url: "", username: "", password: ""});
    const [kavitaSettings, setKavitaSettings] = useState<{url: string, username: string, password: string}>({url: "", username: "", password: ""});
    const [gotifySettings, setGotifySettings] = useState<{url: string, appToken: string}>({url: "", appToken: ""});
    const [lunaseaSettings, setLunaseaSettings] = useState<{webhook: string}>({webhook: ""});
    const [ntfySettings, setNtfySettings] = useState<{url: string, username: string, password: string, topic: string | undefined}>({url: "", username: "", password: "", topic: undefined});

    useEffect(() => {
        console.debug(`${showSettings ? "Showing" : "Not showing"} settings.`);
        if(!showSettings || !backendConnected)
            return;
        UpdateBackendSettings();
        LibraryConnector.GetLibraryConnectors(apiUri).then(setLibraryConnectors).catch(console.error);
        NotificationConnector.GetNotificationConnectors(apiUri).then(setNotificationConnectors).catch(console.error);
    }, [showSettings]);

    useEffect(() => {
        changeSettings(frontendSettings);
    }, [frontendSettings]);

    async function GetSettings(apiUri: string) : Promise<IBackendSettings> {
        //console.info("Getting Settings");
        return getData(`${apiUri}/v2/Settings`)
            .then((json) => {
                //console.info("Got Settings");
                const ret = json as IBackendSettings;
                //console.debug(ret);
                return (ret);
            })
            .catch(Promise.reject);
    }

    function UpdateBackendSettings() {
        GetSettings(apiUri).then(setBackendSettings).catch(console.error);
    }

    const GetKomga = () : ILibraryConnector | undefined =>
        libraryConnectors?.find(con => con.libraryType == 0);

    const KomgaConnected = () : boolean => GetKomga() != undefined;

    const GetKavita = () : ILibraryConnector | undefined =>
        libraryConnectors?.find(con => con.libraryType == 1);

    const KavitaConnected = () : boolean => GetKavita() != undefined;

    const GetGotify = () : INotificationConnector | undefined =>
        notificationConnectors?.find(con => con.notificationConnectorType == 0);

    const GotifyConnected = () : boolean => GetGotify() != undefined;

    const GetLunasea = () : INotificationConnector | undefined =>
        notificationConnectors?.find(con => con.notificationConnectorType == 1);

    const LunaseaConnected = () : boolean => GetLunasea() != undefined;

    const GetNtfy = () : INotificationConnector | undefined =>
        notificationConnectors?.find(con => con.notificationConnectorType == 2);

    const NtfyConnected = () : boolean => GetNtfy() != undefined;

    const SubmitApiUri : KeyboardEventHandler<HTMLInputElement> = (e) => {
        if(e.currentTarget.value.length < 1)
            return;
        if(e.key == "Enter"){
            setFrontendSettings({...frontendSettings, apiUri: e.currentTarget.value});
            RefreshInputs();
        }
    }

    const SubmitUserAgent: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if(e.currentTarget.value.length < 1 || backendSettings === undefined)
            return;
        if(e.key == "Enter"){
            //console.info(`Updating Useragent ${e.currentTarget.value}`);
            postData(`${apiUri}/v2/Settings/UserAgent`, {value: e.currentTarget.value})
                .then((json) => {
                    //console.info(`Successfully updated Useragent ${e.currentTarget.value}`);
                    UpdateBackendSettings();
                    RefreshInputs();
                })
                .catch(() => alert("Failed to update Useragent."));
        }
    }

    const ResetUserAgent: MouseEventHandler<HTMLSpanElement>  = () => {
        //console.info(`Resetting Useragent`);
        postData(`${apiUri}/v2/Settings/UserAgent`, {value: undefined})
            .then((json) => {
                //console.info(`Successfully reset Useragent`);
                UpdateBackendSettings();
                RefreshInputs();
            })
            .catch(() => alert("Failed to update Useragent."));
    }

    const SetAprilFoolsMode : ChangeEventHandler<HTMLInputElement> = (e) => {
        //console.info(`Updating AprilFoolsMode ${e.target.checked}`);
        postData(`${apiUri}/v2/Settings/AprilFoolsMode`, {value: e.target.checked})
            .then((json) => {
                //console.info(`Successfully updated AprilFoolsMode ${e.currentTarget.value}`);
                UpdateBackendSettings();
            })
    }

    function RefreshInputs(){
        alert("Saved.");
        setShowSettings(false);
    }

    return (
        <div id="Settings">
            <img id="SettingsIcon" src="../media/settings-cogwheel.svg" alt="cogwheel" onClick={() => setShowSettings(true)}/>
            {showSettings
                ? <div className="popup">
                    <div className="popupHeader">
                        <h1>Settings</h1>
                        <img alt="Close Settings" className="close" src="../media/close-x.svg" onClick={() => setShowSettings(false)}/>
                    </div>
                    <div id="settingsPopupBody" className="popupBody">
                        <div className="settings-section">
                            TRANGA
                            <div className="settings-section-content">
                                <div className="section-item">
                                    <span className="settings-section-title">API Settings</span>
                                    <label htmlFor="settingApiUri">API URI:</label>
                                    <input placeholder={frontendSettings.apiUri} type="text" id="settingApiUri" onKeyDown={SubmitApiUri} />
                                    <label htmlFor="userAgent">User Agent:</label>
                                    <input id="userAgent" type="text" placeholder={backendSettings != undefined ? backendSettings.userAgent : "UserAgent"} onKeyDown={SubmitUserAgent} />
                                    <span id="resetUserAgent" onClick={ResetUserAgent}>Reset</span>
                                    <label htmlFor="aprilFoolsMode">April Fools Mode</label>
                                    <Toggle id="aprilFoolsMode"
                                            defaultChecked={backendSettings?.aprilFoolsMode ?? false}
                                            onChange={SetAprilFoolsMode} />
                                </div>
                                <div className="section-item">
                                    <span className="settings-section-title">Rate Limits</span>
                                    <label htmlFor="DefaultRL">Default:</label>
                                    <input id="defaultRL" type="text" placeholder={backendSettings != undefined ? backendSettings.requestLimits.Default.toString() : "-1"} />
                                    <label htmlFor="CoverRL">Manga Covers:</label>
                                    <input id="coverRL" type="text" placeholder={backendSettings != undefined ? backendSettings.requestLimits.MangaCover.toString() : "-1"} />
                                    <label htmlFor="ImageRL">Manga Images:</label>
                                    <input id="imageRL" type="text" placeholder={backendSettings != undefined ? backendSettings.requestLimits.MangaImage.toString() : "-1"} />
                                    <label htmlFor="InfoRL">Manga Info:</label>
                                    <input id="infoRL" type="text" placeholder={backendSettings != undefined ? backendSettings.requestLimits.MangaInfo.toString() : "-1"} />
                                </div>
                                <div className="section-item">
                                    <span className="settings-section-title">Appearance</span>
                                    <label htmlFor="cssStyle">Library Style:</label>
                                    <select id="cssStyle">
                                        <option id="card_compact" value="card_compact">Cards (Compact)</option>
                                        <option id="card_hover" value="card_hover">Cards (Hover)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <span className="settings-section-title">Sources</span>
                            <div className="settings-section-content">
                                <div className="section-item">
                                    <span className="settings-section-title">
                                        <img src="../media/connector-icons/mangadex-logo.svg" alt="Mangadex Logo" />
                                        <a href="https://mangadex.org">MangaDex</a>
                                    </span>
                                    <label htmlFor="mDexFeedRL">Feed Rate Limit:</label>
                                    <input id="mDexFeedRL" type="text" placeholder={backendSettings != undefined ? backendSettings.requestLimits.MangaDexFeed.toString() : "-1"} />
                                    <label htmlFor="mDexImageRL">Image Rate Limit:</label>
                                    <input id="mDexImageRL" type="number" placeholder={backendSettings != undefined ? backendSettings.requestLimits.MangaDexImage.toString() : "-1"} />
                                </div>
                            </div>
                        </div>

                        <div className="settings-section" >
                        LIBRARY CONNECTORS
                            <div className="settings-section-content">
                                <div className="section-item" connector-status={KomgaConnected() ? "Configured" : "Not Configured"}>
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/komga.svg' alt="Komga Logo"/>
                                        Komga
                                    </span>
                                    <label htmlFor="komgaUrl">URL</label>
                                    <input placeholder={GetKomga()?.baseUrl ?? "URL"} id="komgaUrl" type="text" onChange={(e) => setKomgaSettings(s => ({...s, url: e.target.value}))} />
                                    <label htmlFor="komgaUsername">Username</label>
                                    <input placeholder={KomgaConnected() ?  "***" : "Username"} id="komgaUsername" type="text" onChange={(e) => setKomgaSettings(s => ({...s, username: e.target.value}))} />
                                    <label htmlFor="komgaPassword">Password</label>
                                    <input placeholder={KomgaConnected() ? "***" : "Password"} id="komgaPassword" type="password" onChange={(e) => setKomgaSettings(s => ({...s, password: e.target.value}))} />
                                    <div className="section-actions">
                                        <span onClick={() => new Komga(komgaSettings).Test(apiUri).then(()=>alert("Test successful"))}>Test</span>
                                        <span onClick={() => new Komga(komgaSettings).Reset(apiUri).then(RefreshInputs)}>Reset</span>
                                        <span onClick={() => new Komga(komgaSettings).Create(apiUri).then(RefreshInputs)}>Apply</span>
                                    </div>
                                </div>
                                <div className="section-item" connector-status={KavitaConnected() ? "Configured" : "Not Configured" }>
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/kavita.png' alt="Kavita Logo"/>
                                        Kavita
                                    </span>
                                    <label htmlFor="kavitaUrl">URL</label>
                                    <input placeholder={GetKavita()?.baseUrl ?? "URL"} id="kavitaUrl" type="text" onChange={(e) => setKavitaSettings(s => ({...s, url: e.target.value}))} />
                                    <label htmlFor="kavitaUsername">Username</label>
                                    <input placeholder={KavitaConnected() ? "***" : "Username"} id="kavitaUsername" type="text" onChange={(e) => setKavitaSettings(s => ({...s, username: e.target.value}))} />
                                    <label htmlFor="kavitaPassword">Password</label>
                                    <input placeholder={KavitaConnected() ? "***" : "Password"} id="kavitaPassword" type="password" onChange={(e) => setKavitaSettings(s => ({...s, password: e.target.value}))} />
                                    <div className="section-actions">
                                        <span onClick={() => new Kavita(kavitaSettings).Test(apiUri).then(()=>alert("Test successful"))}>Test</span>
                                        <span onClick={() => new Kavita(kavitaSettings).Reset(apiUri).then(RefreshInputs)}>Reset</span>
                                        <span onClick={() => new Kavita(kavitaSettings).Create(apiUri).then(RefreshInputs)}>Apply</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            NOTIFICATION CONNECTORS
                            <div className="settings-section-content">
                            <div className="section-item" connector-status={GotifyConnected() ? "Configured" : "Not Configured"}>
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/gotify-logo.png' alt="Gotify Logo"/>
                                        Gotify
                                    </span>
                                    <label htmlFor="gotifyUrl">URL</label>
                                    <input placeholder={GetGotify()?.endpoint ?? "URL"} id="gotifyUrl" type="text" onChange={(e) => setGotifySettings(s => ({...s, url: e.target.value}))} />
                                    <label htmlFor="gotifyAppToken">AppToken</label>
                                    <input placeholder={GotifyConnected() ? "***" : "AppToken"} id="gotifyAppToken" type="text" onChange={(e) => setGotifySettings(s => ({...s, appToken: e.target.value}))} />
                                    <div className="section-actions">
                                        <span onClick={() => new Gotify(gotifySettings).Test(apiUri).then(()=>alert("Test successful"))}>Test</span>
                                        <span onClick={() => new Gotify(gotifySettings).Reset(apiUri).then(RefreshInputs)}>Reset</span>
                                        <span onClick={() => new Gotify(gotifySettings).Create(apiUri).then(RefreshInputs)}>Apply</span>
                                    </div>
                            </div>
                                <div className="section-item"
                                     connector-status={LunaseaConnected() ? "Configured" : "Not Configured"}>
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/lunasea.png' alt="Lunasea Logo"/>
                                        LunaSea
                                    </span>
                                    <label htmlFor="lunaseaWebhook">Webhook id</label>
                                    <input placeholder={GetLunasea() != undefined ? "***" : "device/:id or user/:id"} id="lunaseaWebhook" type="text" onChange={(e) => setLunaseaSettings(s => ({...s, webhook: e.target.value}))} />
                                    <div className="section-actions">
                                        <span onClick={() => new Lunasea(lunaseaSettings).Test(apiUri).then(()=>alert("Test successful"))}>Test</span>
                                        <span onClick={() => new Lunasea(lunaseaSettings).Reset(apiUri).then(RefreshInputs)}>Reset</span>
                                        <span onClick={() => new Lunasea(lunaseaSettings).Create(apiUri).then(RefreshInputs)}>Apply</span>
                                    </div>
                                </div>
                                <div className="section-item"
                                     connector-status={NtfyConnected() ? "Configured" : "Not Configured"}>
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/ntfy.svg' alt="ntfy Logo"/>
                                        Ntfy
                                    </span>
                                    <label htmlFor="ntfyEndpoint">URL</label>
                                    <input placeholder={GetNtfy()?.endpoint ?? "URL"} id="ntfyEndpoint" type="text" onChange={(e) => setNtfySettings(s => ({...s, url: e.target.value}))} />
                                    <label htmlFor="ntfyUsername">Username</label>
                                    <input placeholder={NtfyConnected() ? "***" : "Username"} id="ntfyUsername" type="text" onChange={(e) => setNtfySettings(s => ({...s, username: e.target.value}))} />
                                    <label htmlFor="ntfyPassword">Password</label>
                                    <input placeholder={NtfyConnected() ? "***" : "Password"} id="ntfyPassword" type="password" onChange={(e) => setNtfySettings(s => ({...s, password: e.target.value}))} />
                                    <label htmlFor="ntfyTopic">Topic</label>
                                    <input placeholder={GetNtfy()?.topic ?? "Topic"} id="ntfyTopic" type="text" onChange={(e) => setNtfySettings(s => ({...s, topic: e.target.value}))} />
                                    <div className="section-actions">
                                        <span onClick={() => new Ntfy(ntfySettings).Test(apiUri).then(()=>alert("Test successful"))}>Test</span>
                                        <span onClick={() => new Ntfy(ntfySettings).Reset(apiUri).then(RefreshInputs)}>Reset</span>
                                        <span onClick={() => new Ntfy(ntfySettings).Create(apiUri).then(RefreshInputs)}>Apply</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <></>
            }
        </div>
    );
}