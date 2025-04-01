import {isValidUri} from "../../App";
import {ReactElement, useState} from "react";
import NotificationConnector from "../api/NotificationConnector";
import Loader from "../Loader";
import INtfyRecord from "../types/records/INtfyRecord";

export function NtfyItem ({apiUri} : {apiUri: string}) : ReactElement{
    const [info, setInfo] = useState<INtfyRecord>({
        endpoint: "",
        username: "",
        password: "",
        topic: "",
        priority: 0
    });
    const [loading, setLoading] = useState(false);
    return <div className="NotificationConnectorItem">
        <input className="NotificationConnectorItem-Name" value="Ntfy" disabled={true} />
        <div className="NotificationConnectorItem-Url">
            <input type="text" className="NotificationConnectorItem-RequestUrl" placeholder="URL" onChange={(e) => setInfo({...info, endpoint: e.currentTarget.value})} />
            <input type="text" className="NotificationConnectorItem-Topic" placeholder="Topic" onChange={(e) => setInfo({...info, topic: e.currentTarget.value})} />
        </div>
        <div className="NotificationConnectorItem-Ident">
            <input type="text" className="NotificationConnectorItem-Username" placeholder="Username" onChange={(e) => setInfo({...info, username: e.currentTarget.value})} />
            <input type="password" className="NotificationConnectorItem-Password" placeholder="***" onChange={(e) => setInfo({...info, password: e.currentTarget.value})} />
        </div>
        <div className="NotificationConnectorItem-Priority">
            <label htmlFor="NotificationConnectorItem-Priority">Priority</label>
            <input id="NotificationConnectorItem-Priority-Value" type="number" className="NotificationConnectorItem-Priority-Value" min={1} max={5} defaultValue={3} onChange={(e) => setInfo({...info, priority: e.currentTarget.valueAsNumber})} />
        </div><>
        <button className="NotificationConnectorItem-Save" onClick={(e) => {
            if(info === null || Validate(info) === false)
                return;
            setLoading(true);
            NotificationConnector.CreateNtfy(apiUri, info)
                .finally(() => setLoading(false));
        }}>Add</button>
        <Loader loading={loading} style={{width:"40px",height:"40px",margin:"25vh calc(sin(70)*(50% - 40px))"}}/>
    </>
    </div>;
}

function Validate(record: INtfyRecord) : boolean {
    if(!isValidUri(record.endpoint))
        return false;
    if(record.username.length < 1)
        return false;
    if(record.password.length < 1)
        return false;
    if(record.topic.length < 1)
        return false;
    if(record.priority < 1 || record.priority > 5)
        return false;
    return true;
}