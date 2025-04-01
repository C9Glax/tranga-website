import "../../../styles/notificationConnector.css";

export default interface IGotifyRecord {
    endpoint: string;
    appToken: string;
    priority: number;
}