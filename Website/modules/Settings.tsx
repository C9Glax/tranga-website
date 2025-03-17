import IFrontendSettings from "./interfaces/IFrontendSettings";
import '../styles/settings.css';
import '../styles/react-toggle.css';
import React, {useEffect, useState} from "react";
import INotificationConnector, {NotificationConnectorItem} from "./interfaces/INotificationConnector";
import NotificationConnectorFunctions from "./NotificationConnectorFunctions";

export default function Settings({backendConnected, apiUri, settings} : {backendConnected: boolean, apiUri: string, settings: IFrontendSettings}) {
    let [showSettings, setShowSettings] = useState<boolean>(false);
    let [notificationConnectors, setNotificationConnectors] = useState<INotificationConnector[]>([]);

    useEffect(() => {
        if(!backendConnected)
            return;
        NotificationConnectorFunctions.GetNotificationConnectors(apiUri).then(setNotificationConnectors);
    }, []);

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
                        {notificationConnectors.map(c => <NotificationConnectorItem apiUri={apiUri} notificationConnector={c} />)}
                        <NotificationConnectorItem apiUri={apiUri} notificationConnector={null} />
                    </div>
                </div>
                : null
            }
        </div>
    );
}