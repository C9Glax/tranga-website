import React, {KeyboardEventHandler, useEffect, useState} from 'react';
import IFrontendSettings, {FrontendSettingsWith} from "./interfaces/IFrontendSettings";
import '../styles/settings.css';
import IBackendSettings from "./interfaces/IBackendSettings";
import {getData} from "../App";
import ILibraryConnector from "./interfaces/ILibraryConnector";
import INotificationConnector from "./interfaces/INotificationConnector";

export default function Settings({backendConnected, apiUri, settings, changeSettings} : {backendConnected: boolean, apiUri: string, settings: IFrontendSettings, changeSettings: (settings: IFrontendSettings) => void}) {
    const [frontendSettings, setFrontendSettings] = useState<IFrontendSettings>(settings);
    const [backendSettings, setBackendSettings] = useState<IBackendSettings>();
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [libraryConnectors, setLibraryConnectors] = useState<ILibraryConnector[]>([]);
    const [notificationConnectors, setNotificationConnectors] = useState<INotificationConnector[]>([]);

    useEffect(() => {
        if(!showSettings || !backendConnected)
            return;
        GetSettings(apiUri).then(setBackendSettings).catch(console.error);
        GetLibraryConnectors(apiUri).then(setLibraryConnectors).catch(console.error);
        GetNotificationConnectors(apiUri).then(setNotificationConnectors).catch(console.error);
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

    async function GetLibraryConnectors(apiUri: string) : Promise<ILibraryConnector[]> {
        //console.info("Getting Library Connectors");
        return getData(`${apiUri}/v2/LibraryConnector`)
            .then((json) => {
                //console.info("Got Library Connectors");
                const ret = json as ILibraryConnector[];
                //console.debug(ret);
                return (ret);
            })
            .catch(Promise.reject);
    }

    async function GetNotificationConnectors(apiUri: string) : Promise<INotificationConnector[]> {
        //console.info("Getting Notification Connectors");
        return getData(`${apiUri}/v2/NotificationConnector`)
            .then((json) => {
                //console.info("Got Notification Connectors");
                const ret = json as INotificationConnector[];
                //console.debug(ret);
                return (ret);
            })
            .catch(Promise.reject);
    }

    function GetKomga() : ILibraryConnector | undefined  {
        return libraryConnectors.find(con => con.libraryType == 0);
    }

    function GetKavita() : ILibraryConnector | undefined  {
        return libraryConnectors.find(con => con.libraryType == 1);
    }

    function GetGotify() : INotificationConnector | undefined {
        return notificationConnectors.find(con => con.notificationConnectorType == 0);
    }

    function GetLunasea() : INotificationConnector | undefined {
        return notificationConnectors.find(con => con.notificationConnectorType == 1);
    }

    function GetNtfy() : INotificationConnector | undefined {
        return notificationConnectors.find(con => con.notificationConnectorType == 2);
    }

    const SubmitApiUri : KeyboardEventHandler<HTMLInputElement> = (e) => {
        if(e.currentTarget.value.length < 1)
            return;
        const newSettings = FrontendSettingsWith(frontendSettings, undefined, e.currentTarget.value);
        if(e.key == "Enter"){
            setFrontendSettings(newSettings);
            ClearInputs();
        }
    }

    function ClearInputs(){
        setShowSettings(false);
        setShowSettings(true);
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
                                    <input id="userAgent" type="text" placeholder={backendSettings != undefined ? backendSettings.userAgent : "UserAgent"} />
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
                                <div className="section-item" connector-status={GetKomga() === undefined ? "Not Configured" : "Configured"}>
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/komga.svg' alt="Komga Logo"/>
                                        Komga
                                    </span>
                                    <label htmlFor="komgaUrl">URL</label>
                                    <input placeholder={GetKomga() != undefined ? GetKomga()?.baseUrl : "URL"} id="komgaUrl" type="text" />
                                    <label htmlFor="komgaUsername">Username</label>
                                    <input placeholder={GetKomga() != undefined ? "***" : "Username"} id="komgaUsername" type="text" />
                                    <label htmlFor="komgaPassword">Password</label>
                                    <input placeholder={GetKomga() != undefined ? "***" : "Password"} id="komgaPassword" type="password" />
                                    <div className="section-actions">
                                        <span>Test</span>
                                        <span>Reset</span>
                                        <span>Apply</span>
                                    </div>
                                </div>
                                <div className="section-item" connector-status={GetKavita() === undefined ? "Not Configured" : "Configured"}>
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/kavita.png' alt="Kavita Logo"/>
                                        Kavita
                                    </span>
                                    <label htmlFor="kavitaUrl">URL</label>
                                    <input placeholder={GetKavita() != undefined ? GetKavita()?.baseUrl : "URL"} id="kavitaUrl" type="text" />
                                    <label htmlFor="kavitaUsername">Username</label>
                                    <input placeholder={GetKavita() != undefined ? "***" : "Username"} id="kavitaUsername" type="text" />
                                    <label htmlFor="kavitaPassword">Password</label>
                                    <input placeholder={GetKavita() != undefined ? "***" : "Password"} id="kavitaPassword" type="password"/>
                                    <div className="section-actions">
                                        <span>Test</span>
                                        <span>Reset</span>
                                        <span>Apply</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            NOTIFICATION CONNECTORS
                            <div className="settings-section-content">
                                <div className="section-item" connector-status={GetGotify() === undefined ? "Not Configured" : "Configured"}>
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/gotify-logo.png' alt="Gotify Logo"/>
                                        Gotify
                                    </span>
                                    <label htmlFor="gotifyUrl">URL</label>
                                    <input placeholder={GetGotify() != undefined ? GetGotify()?.endpoint : "URL"} id="gotifyUrl" type="text" />
                                    <label htmlFor="gotifyAppToken">AppToken</label>
                                    <input placeholder={GetGotify() != undefined ? GetGotify()?.appToken : "AppToken"} id="gotifyAppToken" type="text" />
                                    <div className="section-actions">
                                        <span>Test</span>
                                        <span>Reset</span>
                                        <span>Apply</span>
                                    </div>
                                </div>
                                <div className="section-item" connector-status={GetLunasea() === undefined ? "Not Configured" : "Configured"}>
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/lunasea.png' alt="Lunasea Logo"/>
                                        LunaSea
                                    </span>
                                    <label htmlFor="lunaseaWebhook">Webhook id</label>
                                    <input placeholder={GetLunasea() != undefined ? GetLunasea()?.id : "device/:id or user/:id"} id="lunaseaWebhook" type="text"/>
                                    <div className="section-actions">
                                        <span>Test</span>
                                        <span>Reset</span>
                                        <span>Apply</span>
                                    </div>
                                </div>
                                <div className="section-item" connector-status={GetNtfy() === undefined ? "Not Configured" : "Configured"}>
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/ntfy.svg' alt="ntfy Logo"/>
                                        Ntfy
                                    </span>
                                    <label htmlFor="ntfyEndpoint">URL</label>
                                    <input placeholder={GetNtfy() != undefined ? GetNtfy()?.endpoint : "URL"} id="ntfyEndpoint" type="text"/>
                                    <label htmlFor="ntfyUsername">Username</label>
                                    <input placeholder={GetNtfy() != undefined ? "***" : "Username"} id="ntfyUsername" type="text"/>
                                    <label htmlFor="ntfyPassword">Password</label>
                                    <input placeholder={GetNtfy() != undefined ? "***" : "Password"} id="ntfyPassword" type="password"/>
                                    <label htmlFor="ntfyTopic">Topic</label>
                                    <input placeholder={GetNtfy() != undefined ? GetNtfy()?.topic : "Topic"} id="ntfyTopic" type="text"/>
                                    <div className="section-actions">
                                        <span>Test</span>
                                        <span>Reset</span>
                                        <span>Apply</span>
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