import IFrontendSettings from "./interfaces/IFrontendSettings";
import '../styles/settings.css';
import '../styles/react-toggle.css';
import React, {useEffect, useState} from "react";
import INotificationConnector, {NotificationConnectorItem} from "./interfaces/INotificationConnector";
import NotificationConnectorFunctions from "./NotificationConnectorFunctions";

export default function Settings({backendConnected, apiUri, frontendSettings, setFrontendSettings} : {backendConnected: boolean, apiUri: string, frontendSettings: IFrontendSettings, setFrontendSettings: (settings: IFrontendSettings) => void}) {
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
                        <div className="settings-apiuri">
                            <label>ApiUri</label>
                            <input type="url" defaultValue={frontendSettings.apiUri} onChange={(e) => {
                                let newSettings = frontendSettings;
                                newSettings.apiUri = e.currentTarget.value;
                                setFrontendSettings(newSettings);
                            }} id="ApiUri" />
                        </div>
                        <div className="settings-apiuri">
                            <label>Default Job-Interval</label>
                            <input type="time" defaultValue={new Date(frontendSettings.jobInterval).getTime()} onChange={(e) => {
                                let newSettings = frontendSettings;
                                newSettings.jobInterval = e.currentTarget.valueAsDate ?? frontendSettings.jobInterval;
                                setFrontendSettings(newSettings);
                                console.log(frontendSettings);
                            }}/>
                        </div>
                        {notificationConnectors.map(c => <NotificationConnectorItem apiUri={apiUri} notificationConnector={c} />)}
                        <NotificationConnectorItem apiUri={apiUri} notificationConnector={null} />
                    </div>
                </div>
                : null
            }
        </div>
    );
}