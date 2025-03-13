import IFrontendSettings from "./interfaces/IFrontendSettings";
import '../styles/settings.css';
import '../styles/react-toggle.css';

export default function Settings({backendConnected, apiUri, settings, changeSettings} : {backendConnected: boolean, apiUri: string, settings: IFrontendSettings, changeSettings: (settings: IFrontendSettings) => void}) {

}