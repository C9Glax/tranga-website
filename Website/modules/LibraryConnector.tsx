import {deleteData, getData, postData} from "../App";
import ILibraryConnector from "./interfaces/ILibraryConnector";

export default abstract class LibraryConnector
{
    static async GetLibraryConnectors(apiUri: string) : Promise<ILibraryConnector[]> {
    //console.info("Getting Library Connectors");
    return getData(`${apiUri}/v2/LibraryConnector`)
        .then((json) => {
            //console.info("Got Library Connectors");
            const ret = json as ILibraryConnector[];
            //console.debug(ret);
            return (ret);
        })
        .catch(Promise.reject);
    }
    public url = "";

    protected constructor(url: string) {
        this.url = url;
    }

    public SetUrl(url: string){
        this.url = url;
    }

    public abstract Test(apiUri: string) : Promise<boolean>;
    public abstract Reset(apiUri: string) : Promise<boolean>;
    public abstract Create(apiUri: string) : Promise<boolean>;
    protected abstract CheckConnector() : boolean;

    protected async TestConnector(apiUri: string, connectorType: string, data: object): Promise<boolean> {
        if(!this.CheckConnector())
            return Promise.reject("Connector not fully configured.");
        //console.info(`Testing ${connectorType}`);
        return postData(`${apiUri}/v2/LibraryConnector/${connectorType}/Test`, data)
            .then((json) => {
                //console.info(`Successfully tested ${connectorType}`);
                return true;
            })
            .catch(Promise.reject);
    }

    protected async ResetConnector(apiUri: string, connectorType: string): Promise<boolean> {
        //console.info(`Deleting ${connectorType}`);
        return deleteData(`${apiUri}/v2/LibraryConnector/${connectorType}`)
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
        return postData(`${apiUri}/v2/LibraryConnector/${connectorType}`, data)
            .then((json) => {
                //console.info(`Successfully created ${connectorType}`);
                return true;
            })
            .catch(Promise.reject);
    }
}

export class Komga extends LibraryConnector
{
    private username = "";
    private password = "";

    constructor({url, username, password} : {url: string, username: string, password: string}){
        super(url);
        this.username = username;
        this.password = password;
    }

    public async Test(apiUri: string) : Promise<boolean> {
        return this.TestConnector(apiUri, "Komga", {url: this.url, username: this.username, password: this.password}).then(() => true).catch(() => false);
    }

    public async Reset(apiUri: string) : Promise<boolean> {
        return this.ResetConnector(apiUri, "Komga").then(() => true).catch(() => false);
    }

    public async Create(apiUri: string) : Promise<boolean> {
        return this.CreateConnector(apiUri, "Komga", {url: this.url, username: this.username, password: this.password}).then(() => true).catch(() => false);
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

export class Kavita extends LibraryConnector
{
    private username = "";
    private password = "";

    constructor({url, username, password} : {url: string, username: string, password: string}) {
        super(url);
        this.username = username;
        this.password = password;
    }

    public async Test(apiUri: string) : Promise<boolean> {
        return this.TestConnector(apiUri, "Kavita", {url: this.url, username: this.username, password: this.password}).then(() => true).catch(() => false);
    }

    public async Reset(apiUri: string) : Promise<boolean> {
        return this.ResetConnector(apiUri, "Kavita").then(() => true).catch(() => false);
    }

    public async Create(apiUri: string) : Promise<boolean> {
        return this.CreateConnector(apiUri, "Kavita", {url: this.url, username: this.username, password: this.password}).then(() => true).catch(() => false);
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