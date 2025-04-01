import "../../../styles/notificationConnector.css";
import {isValidUri} from "../../../App";

export default interface IGotifyRecord {
    endpoint: string;
    appToken: string;
    priority: number;
}