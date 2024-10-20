export default interface INotificationConnector {
    "notificationConnectorType": number; //see NotificationConnectorType
    "endpoint": string | undefined;//only on Ntfy, Gotify
    "appToken": string | undefined;//only on Gotify
    "auth": string | undefined;//only on Ntfy
    "topic": string | undefined;//only on Ntfy
    "id": string | undefined;//only on LunaSea
}