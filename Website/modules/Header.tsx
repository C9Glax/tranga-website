import React from 'react';
import '../styles/header.css'
import Settings from "./Settings";
import IFrontendSettings from "./types/IFrontendSettings";

export default function Header({backendConnected, apiUri, settings, setFrontendSettings} : {backendConnected: boolean, apiUri: string, settings: IFrontendSettings, setFrontendSettings: (settings: IFrontendSettings) => void}){
    return (
        <header>
            <div id="titlebox">
                <img alt="website image is Blahaj" src="../media/blahaj.png"/>
                <span>Tranga</span>
            </div>
            <Settings backendConnected={backendConnected} apiUri={apiUri} frontendSettings={settings} setFrontendSettings={setFrontendSettings} />
        </header>)
}