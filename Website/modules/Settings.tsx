import React, {useState} from 'react';
import IFrontendSettings from "./interfaces/IFrontendSettings";
import '../styles/settings.css';

export default function Settings({settings, changeSettings} : {settings: IFrontendSettings, changeSettings(settings: IFrontendSettings): void}) {
    const [frontendSettings] = useState<IFrontendSettings>(settings);
    const [showSettings, setShowSettings] = useState<boolean>(false);

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
                                    <input placeholder="https://" type="text" id="settingApiUri" />
                                    <label htmlFor="userAgent">User Agent:</label>
                                    <input placeholder="UserAgent" id="userAgent" type="text" />
                                </div>
                                <div className="section-item">
                                    <span className="settings-section-title">Rate Limits</span>
                                    <label htmlFor="DefaultRL">Default:</label>
                                    <input id="defaultRL" type="text" />
                                    <label htmlFor="CoverRL">Manga Covers:</label>
                                    <input id="coverRL" type="text" />
                                    <label htmlFor="ImageRL">Manga Images:</label>
                                    <input id="imageRL" type="text" />
                                    <label htmlFor="InfoRL">Manga Info:</label>
                                    <input id="infoRL" type="text" />
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
                                    <input id="mDexFeedRL" type="text" />
                                    <label htmlFor="mDexImageRL">Image Rate Limit:</label>
                                    <input id="mDexImageRL" type="text" />
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                        LIBRARY CONNECTORS
                            <div className="settings-section-content">
                                <div className="section-item">
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/komga.svg' alt="Komga Logo" />
                                        Komga
                                    </span>
                                    <label htmlFor="komgaUrl"></label>
                                    <input placeholder="URL" id="komgaUrl" type="text" />
                                    <label htmlFor="komgaUsername"></label>
                                    <input placeholder="Username" id="komgaUsername" type="text" />
                                    <label htmlFor="komgaPassword"></label>
                                    <input placeholder="Password" id="komgaPassword" type="password" />
                                    <div className="section-buttons-container">
                                        <span>Test</span>
                                        <span>Reset</span>
                                        <span>Apply</span>
                                    </div>
                                </div>
                                <div className="section-item">
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/kavita.png' alt="Kavita Logo" />
                                        Kavita
                                    </span>
                                    <label htmlFor="kavitaUrl"></label>
                                    <input placeholder="URL" id="kavitaUrl" type="text" />
                                    <label htmlFor="kavitaUsername"></label>
                                    <input placeholder="Username" id="kavitaUsername" type="text" />
                                    <label htmlFor="kavitaPassword"></label>
                                    <input placeholder="Password" id="kavitaPassword" type="password"/>
                                    <div className="section-buttons-container">
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
                                <div className="section-item">
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/gotify-logo.png' alt="Gotify Logo" />
                                        Gotify
                                    </span>
                                    <label htmlFor="gotifyUrl"></label>
                                    <input placeholder="URL" id="gotifyUrl" type="text" />
                                    <label htmlFor="gotifyAppToken"></label>
                                    <input placeholder="App-Token" id="gotifyAppToken" type="text" />
                                    <div className="section-buttons-container">
                                        <span>Test</span>
                                        <span>Reset</span>
                                        <span>Apply</span>
                                    </div>
                                </div>
                                <div className="section-item">
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/lunasea.png' alt="Lunasea Logo" />
                                        LunaSea
                                    </span>
                                    <label htmlFor="lunaseaWebhook"></label>
                                    <input placeholder="device/:id or user/:id" id="lunaseaWebhook" type="text"/>
                                    <div className="section-buttons-container">
                                        <span>Test</span>
                                        <span>Reset</span>
                                        <span>Apply</span>
                                    </div>
                                </div>
                                <div className="section-item">
                                    <span className="settings-section-title">
                                        <img src='../media/connector-icons/ntfy.svg' alt="ntfy Logo" />
                                        Ntfy
                                    </span>
                                    <label htmlFor="ntfyEndpoint"></label>
                                    <input placeholder="URL" id="ntfyEndpoint" type="text" />
                                    <label htmlFor="ntfyAuth"></label>
                                    <input placeholder="Auth" id="ntfyAuth" type="text" />
                                    <div className="section-buttons-container">
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