import {ReactElement, useState} from "react";
import NotificationConnectorFunctions from "../../NotificationConnectorFunctions";
import Loader from "../../Loader";
import "../../../styles/notificationConnector.css";
import {isValidUri} from "../../../App";

export default interface IGotifyRecord {
    endpoint: string;
    appToken: string;
    priority: number;
}

function Validate(record: IGotifyRecord) : boolean {
    if(!isValidUri(record.endpoint))
        return false;
    if(record.appToken.length < 1)
        return false;
    if(record.priority < 1 || record.priority > 5)
        return false;
    return true;
}

export function GotifyItem ({apiUri} : {apiUri: string}) : ReactElement{
    const [record, setRecord] = useState<IGotifyRecord>({
        endpoint: "",
        appToken: "",
        priority: 3
    });
    const [loading, setLoading] = useState(false);
    return <div className="NotificationConnectorItem">
        <input className="NotificationConnectorItem-Name" value="Gotify" disabled={true} />
        <div className="NotificationConnectorItem-Url">
            <input type="text" className="NotificationConnectorItem-RequestUrl" placeholder="URL" onChange={(e) => setRecord({...record, endpoint: e.currentTarget.value})} />
            <input type="text" className="NotificationConnectorItem-AppToken" placeholder="Apptoken" onChange={(e) => setRecord({...record, appToken: e.currentTarget.value})} />
        </div>
        <div className="NotificationConnectorItem-Priority">
            <label htmlFor="NotificationConnectorItem-Priority">Priority</label>
            <input id="NotificationConnectorItem-Priority-Value" type="number" className="NotificationConnectorItem-Priority-Value" min={1} max={5} defaultValue={3} onChange={(e) => setRecord({...record, priority: e.currentTarget.valueAsNumber})} />
        </div>
        <>
            <button className="NotificationConnectorItem-Save" onClick={(e) => {
                if(record === null || Validate(record) === false)
                    return;
                setLoading(true);
                NotificationConnectorFunctions.CreateGotify(apiUri, record)
                    .finally(() => setLoading(false));
            }}>Add</button>
            <Loader loading={loading} style={{width:"40px",height:"40px",margin:"calc(sin(70)*(50% - 40px))"}}/>
        </>
    </div>;
}