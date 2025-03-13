export default interface INotificationConnector {
    name: string;
    url: string;
    headers: Record<string, string>[];
    httpMethod: string;
    body: string;
}