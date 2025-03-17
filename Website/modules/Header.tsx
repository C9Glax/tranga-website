import React from 'react';
import '../styles/header.css'
import IFrontendSettings from "./interfaces/IFrontendSettings";
import Settings from "./Settings";

export default function Header({backendConnected, apiUri, settings} : {backendConnected: boolean, apiUri: string, settings: IFrontendSettings}){
    return (
        <header>
            <div id="titlebox">
                <img alt="website image is Blahaj" src="../media/blahaj.png"/>
                <span>Tranga</span>
            </div>
            <Settings backendConnected={backendConnected} apiUri={apiUri} settings={settings} />
        </header>)
}