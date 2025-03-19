import {ReactElement, ReactEventHandler, useState} from "react";
import "../../styles/notificationConnector.css";
import Loader from "../Loader";
import NotificationConnectorFunctions from "../NotificationConnectorFunctions";

export default interface INotificationConnector {
    name: string;
    url: string;
    headers: Record<string, string>[];
    httpMethod: string;
    body: string;
}

export function NotificationConnectorItem({apiUri, notificationConnector} : {apiUri: string, notificationConnector: INotificationConnector | null}) : ReactElement {
    const AddHeader : ReactEventHandler<HTMLButtonElement> = (e) => {
        let header : Record<string, string> = {};
        let x = info;
        x.headers = [header, ...x.headers];
        setInfo(x);
        setHeaderElements([...headerElements, <HeaderElement record={header} />])
    }
    const [headerElements, setHeaderElements] = useState<ReactElement[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [info, setInfo] = useState<INotificationConnector>({
        name: "",
        url: "",
        headers: [],
        httpMethod: "",
        body: ""
    });

    return (<div className="NotificationConnectorItem" key={notificationConnector ? notificationConnector.name : "new"}>
        <p className="NotificationConnectorItem-Name">{notificationConnector ? notificationConnector.name : "New Notification Connector"}</p>
        <div className="NotificationConnectorItem-Url">
            <select className="NotificationConnectorItem-RequestMethod" defaultValue={notificationConnector ? notificationConnector.httpMethod : ""} disabled={notificationConnector != null} onChange={(e) => {
                let x = info;
                x.httpMethod = e.currentTarget.value;
                setInfo(x);
            }}>
                <option value="" disabled hidden>Request Method</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
            </select>
            <input type="url" className="NotificationConnectorItem-RequestUrl" placeholder="URL" defaultValue={notificationConnector ? notificationConnector.url : ""} disabled={notificationConnector != null} onChange={(e) => {
                let x = info;
                x.url = e.currentTarget.value;
                setInfo(x);
            }} />
        </div>
        <textarea className="NotificationConnectorItem-Body" placeholder="Request-Body" defaultValue={notificationConnector ? notificationConnector.body : ""} disabled={notificationConnector != null} onChange={(e) => {
            let x = info;
            x.body = e.currentTarget.value;
            setInfo(x);
        }} />
        {notificationConnector != null ? null :
            (
                <p className="NotificationConnectorItem-Explanation">Explanation Text</p>
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
        {notificationConnector != null ? null : (
            <>
                <button className="NotificationConnectorItem-Save" onClick={(e) => {
                    setLoading(true);
                    NotificationConnectorFunctions.CreateNotificationConnector(apiUri, info)
                        .finally(() => setLoading(false));
                }}>Add</button>
                <Loader loading={loading} style={{width:"40px",height:"40px",margin:"calc(sin(70)*(50% - 40px))"}}/>
            </>
        )}
    </div>);
}

function HeaderElement({record, disabled} : {record: Record<string, string>, disabled?: boolean | null}) : ReactElement {
    return <div className="NotificationConnectorItem-Header" key={record.name}>
        <input type="text" className="NotificationConnectorItem-Header-Key" placeholder="Header-Key" defaultValue={record.name} disabled={disabled?disabled:false} onChange={(e) => record.name = e.currentTarget.value}/>
        <input type="text" className="NotificationConnectorItem-Header-Value" placeholder="Header-Value" defaultValue={record.value} disabled={disabled?disabled:false} onChange={(e) => record.value = e.currentTarget.value} />
    </div>;
}