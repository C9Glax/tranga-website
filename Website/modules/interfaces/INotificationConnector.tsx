import {ReactElement, ReactEventHandler, useState} from "react";
import "../../styles/notificationConnector.css";
import Loader from "../Loader";
import NotificationConnectorFunctions from "../NotificationConnectorFunctions";
import {LunaseaItem} from "./records/ILunaseaRecord";
import {GotifyItem} from "./records/IGotifyRecord";
import {NtfyItem} from "./records/INtfyRecord";

export default interface INotificationConnector {
    name: string;
    url: string;
    headers: Record<string, string>[];
    httpMethod: string;
    body: string;
}

export function NotificationConnectorItem({apiUri, notificationConnector} : {apiUri: string, notificationConnector: INotificationConnector | null}) : ReactElement {
    if(notificationConnector != null)
        return <DefaultItem apiUri={apiUri} notificationConnector={notificationConnector} />

    const [selectedConnectorElement, setSelectedConnectorElement] = useState<ReactElement>(<DefaultItem apiUri={apiUri} notificationConnector={null} />);

    return <div>
        <div>New Notification Connector</div>
        <label>Type</label>
        <select defaultValue="default" onChange={(e) => {
            switch (e.currentTarget.value){
                case "default": setSelectedConnectorElement(<DefaultItem apiUri={apiUri} notificationConnector={null} />); break;
                case "gotify": setSelectedConnectorElement(<GotifyItem apiUri={apiUri} />); break;
                case "ntfy": setSelectedConnectorElement(<NtfyItem apiUri={apiUri} />); break;
                case "lunasea": setSelectedConnectorElement(<LunaseaItem apiUri={apiUri} />); break;
            }
        }}>
            <option value="default">Generic REST</option>
            <option value="gotify">Gotify</option>
            <option value="ntfy">Ntfy</option>
            <option value="lunasea">Lunasea</option>
        </select>
        {selectedConnectorElement}
    </div>;
}

function DefaultItem({apiUri, notificationConnector}:{apiUri: string, notificationConnector: INotificationConnector | null}) : ReactElement {
    const AddHeader : ReactEventHandler<HTMLButtonElement> = () => {
        let header : Record<string, string> = {};
        let x = info;
        x.headers = [header, ...x.headers];
        setInfo(x);
        setHeaderElements([...headerElements, <HeaderElement record={header} />])
    }
    const [headerElements, setHeaderElements] = useState<ReactElement[]>([]);
    const [info, setInfo] = useState<INotificationConnector>({
        name: "",
        url: "",
        headers: [],
        httpMethod: "",
        body: ""
    });
    const [loading, setLoading] = useState<boolean>(false);
    return <div className="NotificationConnectorItem">
        <input className="NotificationConnectorItem-Name" placeholder="Name" defaultValue={notificationConnector ? notificationConnector.name : ""}
               disabled={notificationConnector != null} onChange={(e) => setInfo({...info, name: e.currentTarget.value})} />
        <div className="NotificationConnectorItem-Url">
            <select className="NotificationConnectorItem-RequestMethod" defaultValue={notificationConnector ? notificationConnector.httpMethod : ""}
                    disabled={notificationConnector != null} onChange={(e)=> setInfo({...info, httpMethod: e.currentTarget.value})} >
                <option value="" disabled hidden>Request Method</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
            </select>
            <input type="url" className="NotificationConnectorItem-RequestUrl" placeholder="URL" defaultValue={notificationConnector ? notificationConnector.url : ""}
                   disabled={notificationConnector != null} onChange={(e) => setInfo({...info, url: e.currentTarget.value})}  />
        </div>
        <textarea className="NotificationConnectorItem-Body" placeholder="Request-Body" defaultValue={notificationConnector ? notificationConnector.body : ""}
                  disabled={notificationConnector != null} onChange={(e)=> setInfo({...info, body: e.currentTarget.value})}  />
        {notificationConnector != null ? null :
            (
                <p className="NotificationConnectorItem-Explanation">Formatting placeholders: "%title" and "%text" can be placed in url, header-values and body and will be replaced when notifications are sent</p>
            )}
        <div className="NotificationConnectorItem-Headers">
            {headerElements}
            {notificationConnector
                ? notificationConnector.headers.map((h: Record<string, string>) =>
                    (<HeaderElement record={h} disabled={notificationConnector != null}/>)
                ) :
                (
                    <button className="NotificationConnectorItem-AddHeader" onClick={AddHeader}>Add Header</button>
                )
            }
        </div>
        <>
            <button className="NotificationConnectorItem-Save" onClick={(e) => {
                setLoading(true);
                NotificationConnectorFunctions.CreateNotificationConnector(apiUri, info)
                    .finally(() => setLoading(false));
            }}>Add</button>
            <Loader loading={loading} style={{width:"40px",height:"40px",margin:"25vh calc(sin(70)*(50% - 40px))"}}/>
        </>
    </div>
}

function HeaderElement({record, disabled} : {record: Record<string, string>, disabled?: boolean | null}) : ReactElement {
    return <div className="NotificationConnectorItem-Header" key={record.name}>
        <input type="text" className="NotificationConnectorItem-Header-Key" placeholder="Header-Key" defaultValue={record.name} disabled={disabled?disabled:false} onChange={(e) => record.name = e.currentTarget.value}/>
        <input type="text" className="NotificationConnectorItem-Header-Value" placeholder="Header-Value" defaultValue={record.value} disabled={disabled?disabled:false} onChange={(e) => record.value = e.currentTarget.value} />
    </div>;
}