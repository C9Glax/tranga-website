import React from 'react';
import '../styles/header.css'
import IFrontendSettings from "./interfaces/IFrontendSettings";

export default function Header({backendConnected, apiUri, settings, changeSettings} : {backendConnected: boolean, apiUri: string, settings: IFrontendSettings, changeSettings(settings: IFrontendSettings): void}){
    return (
        <header>
            <div id="titlebox">
                <img alt="website image is Blahaj" src="../media/blahaj.png"/>
                <span>Tranga</span>
            </div>
        </header>)
}