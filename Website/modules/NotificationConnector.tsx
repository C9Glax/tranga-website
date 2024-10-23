import INotificationConnector from "./interfaces/INotificationConnector";
import {deleteData, getData, postData} from "../App";

export default abstract class NotificationConnector {

    static async GetNotificationConnectors(apiUri: string) : Promise<INotificationConnector[]> {
        //console.info("Getting Notification Connectors");
        return getData(`${apiUri}/v2/NotificationConnector`)
            .then((json) => {
                //console.info("Got Notification Connectors");
                const ret = json as INotificationConnector[];
                //console.debug(ret);
                return (ret);
            })
            .catch(Promise.reject);
    }

    protected constructor() {

    }

    public abstract Test(apiUri: string) : Promise<boolean>;
    public abstract Reset(apiUri: string) : Promise<boolean>;
    public abstract Create(apiUri: string) : Promise<boolean>;
    protected abstract CheckConnector() : boolean;

    protected async TestConnector(apiUri: string, connectorType: string, data: object): Promise<boolean> {
        if(!this.CheckConnector())
            return Promise.reject("Connector not fully configured.");
        //console.info(`Testing ${connectorType}`);
        return postData(`${apiUri}/v2/NotificationConnector/${connectorType}/Test`, data)
            .then((json) => {
                //console.info(`Successfully tested ${connectorType}`);
                return true;
            })
            .catch(Promise.reject);
    }

    protected async ResetConnector(apiUri: string, connectorType: string): Promise<boolean> {
        if(!this.CheckConnector())
            return Promise.reject("Connector not fully configured.");
        //console.info(`Deleting ${connectorType}`);
        return deleteData(`${apiUri}/v2/NotificationConnector/${connectorType}`)
            .then((json) => {
                //console.info(`Successfully deleted ${connectorType}`);
                return true;
            })
            .catch(Promise.reject);
    }

    protected async CreateConnector(apiUri: string, connectorType: string, data: object): Promise<boolean> {
        if(!this.CheckConnector())
            return Promise.reject("Connector not fully configured.");
        //console.info(`Creating ${connectorType}`);
        return postData(`${apiUri}/v2/NotificationConnector/${connectorType}`, data)
            .then((json) => {
                //console.info(`Successfully created ${connectorType}`);
                return true;
            })
            .catch(Promise.reject);
    }
}

export class Gotify extends NotificationConnector
{
    public url = "";
    private appToken = "";

    constructor({url, appToken} : {url: string, appToken:string}){
        super();
        this.url = url;
        this.appToken = appToken;
    }

    public async Test(apiUri: string) : Promise<boolean> {
        return this.TestConnector(apiUri, "Gotify", {url: this.url, appToken: this.appToken}).then(() => true).catch(() => false);
    }

    public async Reset(apiUri: string) : Promise<boolean> {
        return this.ResetConnector(apiUri, "Gotify").then(() => true).catch(() => false);
    }

    public async Create(apiUri: string) : Promise<boolean> {
        return this.CreateConnector(apiUri, "Gotify", {url: this.url, appToken: this.appToken}).then(() => true).catch(() => false);
    }

    protected CheckConnector(): boolean {
        try{
            new URL(this.url)
        }catch{
            return false;
        }
        if(this.appToken.length < 1 || this.appToken.length < 1)
            return false;
        return true;
    }
}

export class Lunasea extends NotificationConnector
{
    private webhook = "";

    constructor({webhook} : {webhook: string}){
        super();
        this.webhook = webhook;
    }

    public async Test(apiUri: string) : Promise<boolean> {
        return this.TestConnector(apiUri, "LunaSea", {webhook: this.webhook}).then(() => true).catch(() => false);
    }

    public async Reset(apiUri: string) : Promise<boolean> {
        return this.ResetConnector(apiUri, "LunaSea").then(() => true).catch(() => false);
    }

    public async Create(apiUri: string) : Promise<boolean> {
        return this.CreateConnector(apiUri, "LunaSea", {webhook: this.webhook}).then(() => true).catch(() => false);
    }

    protected CheckConnector(): boolean {
        if(this.webhook.length < 1 || this.webhook.length < 1)
            return false;
        return true;
    }
}

export class Ntfy extends NotificationConnector
{
    public url = "";
    private username = "";
    private password = "";
    public topic:string | undefined = undefined;

    constructor({url, username, password, topic} : {url: string, username: string, password: string, topic : string | undefined}){
        super();
        this.url = url;
        this.username = username;
        this.password = password;
        this.topic = topic;
    }

    public async Test(apiUri: string) : Promise<boolean> {
        return this.TestConnector(apiUri, "Ntfy", {url: this.url, username: this.username, password: this.password, topic: this.topic}).then(() => true).catch(() => false);
    }

    public async Reset(apiUri: string) : Promise<boolean> {
        return this.ResetConnector(apiUri, "Ntfy").then(() => true).catch(() => false);
    }

    public async Create(apiUri: string) : Promise<boolean> {
        return this.CreateConnector(apiUri, "Ntfy", {url: this.url, username: this.username, password: this.password, topic: this.topic}).then(() => true).catch(() => false);
    }

    protected CheckConnector(): boolean {
        try{
            new URL(this.url)
        }catch{
            return false;
        }
        if(this.username.length < 1 || this.password.length < 1)
            return false;
        return true;
    }
}