import React from 'react';
import '../styles/header.css'
import Settings from "./Settings";
import IFrontendSettings from "./interfaces/IFrontendSettings";

export default function Header({settings, changeSettings} : {settings: IFrontendSettings, changeSettings(settings: IFrontendSettings): void}){
    return (
        <header>
            <div id="titlebox">
                <img alt="website image is Blahaj" src="../media/blahaj.png"/>
                <span>Tranga</span>
            </div>
            <Settings settings={settings} changeSettings={changeSettings} />
        </header>)
}