import {ReactElement, useState} from "react";
import NotificationConnectorFunctions from "../../NotificationConnectorFunctions";
import Loader from "../../Loader";
import "../../../styles/notificationConnector.css";
import {isValidUri} from "../../../App";

export default interface IPushoverRecord {
    apptoken: string;
    user: string;
}

function Validate(record: IPushoverRecord) : boolean {
    if(record.apptoken.length < 1)
        return false;
    if(record.user.length < 1)
        return false;
    return true;
}

export function PushoverItem ({apiUri} : {apiUri: string}) : ReactElement{
    const [info, setInfo] = useState<IPushoverRecord>({
        apptoken: "",
        user: ""
    });
    const [loading, setLoading] = useState(false);
    return <div className="NotificationConnectorItem">
        <input className="NotificationConnectorItem-Name" value="Pushover" disabled={true} />
        <div className="NotificationConnectorItem-Ident">
            <input type="text" className="NotificationConnectorItem-Apptoken" placeholder="Apptoken" onChange={(e) => setInfo({...info, apptoken: e.currentTarget.value})} />
            <input type="text" className="NotificationConnectorItem-User" placeholder="User" onChange={(e) => setInfo({...info, user: e.currentTarget.value})} />
        </div>
        <>
            <button className="NotificationConnectorItem-Save" onClick={(e) => {
                if(info === null || Validate(info) === false)
                    return;
                setLoading(true);
                NotificationConnectorFunctions.CreatePushover(apiUri, info)
                    .finally(() => setLoading(false));
            }}>Add</button>
            <Loader loading={loading} style={{width:"40px",height:"40px",margin:"25vh calc(sin(70)*(50% - 40px))"}}/>
        </>
    </div>;
}