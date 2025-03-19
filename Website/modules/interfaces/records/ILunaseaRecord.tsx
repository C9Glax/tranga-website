import {ReactElement, useState} from "react";
import NotificationConnectorFunctions from "../../NotificationConnectorFunctions";
import Loader from "../../Loader";
import "../../../styles/notificationConnector.css";

export default interface ILunaseaRecord {
    id: string;
}

const regex = new RegExp("(?:device|user)\/[0-9a-zA-Z\-]+");
function Validate(record: ILunaseaRecord) : boolean {
    return regex.test(record.id);
}

export function LunaseaItem ({apiUri} : {apiUri: string}) : ReactElement{
    const [record, setRecord] = useState<ILunaseaRecord>({
        id: ""
    });
    const [loading, setLoading] = useState(false);
    return <div className="NotificationConnectorItem">
        <input className="NotificationConnectorItem-Name" value="LunaSea" disabled={true} />
        <div className="NotificationConnectorItem-Url">
            <input type="text" className="NotificationConnectorItem-RequestUrl" placeholder="device/:device_id or user/:user_id" onChange={(e) => setRecord({...record, id: e.currentTarget.value})} />
        </div>
        <>
            <button className="NotificationConnectorItem-Save" onClick={(e) => {
                if(record === null || Validate(record) === false)
                    return;
                setLoading(true);
                NotificationConnectorFunctions.CreateLunasea(apiUri, record)
                    .finally(() => setLoading(false));
            }}>Add</button>
            <Loader loading={loading} style={{width:"40px",height:"40px",margin:"calc(sin(70)*(50% - 40px))"}}/>
        </>
    </div>;
}