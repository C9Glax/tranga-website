import {ReactElement, ReactEventHandler, useState} from "react";

export default interface INotificationConnector {
    name: string;
    url: string;
    headers: Record<string, string>[];
    httpMethod: string;
    body: string;
}

export function NotificationConnectorItem({apiUri, notificationConnector} : {apiUri: string, notificationConnector: INotificationConnector | null}) : ReactElement {
    const Save : ReactEventHandler<HTMLButtonElement> = (e) => {

    }

    const AddHeader : ReactEventHandler<HTMLButtonElement> = (e) => {
        const div = e.currentTarget.parentElement as HTMLDivElement;
        setHeaderElements([...headerElements, <HeaderElement record={null} />])
    }
    const [headerElements, setHeaderElements] = useState<ReactElement[]>([]);

    return (<div className="NotificationConnectorItem" key={notificationConnector ? notificationConnector.name : "new"}>
        <p className="NotificationConnectorItem-Name">{notificationConnector ? notificationConnector.name : "New Notification Connector"}</p>
        <select className="NotificationConnectorItem-RequestMethod" defaultValue={notificationConnector ? notificationConnector.httpMethod : ""} disabled={notificationConnector != null}>
            <option value="" disabled hidden>Request Method</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
        </select>
        <input type="url" className="NotificationConnectorItem-Url" placeholder="URL" value={notificationConnector ? notificationConnector.url : ""} disabled={notificationConnector != null} />
        <textarea className="NotificationConnectorItem-Body" placeholder="Request-Body" value={notificationConnector ? notificationConnector.body : ""} disabled={notificationConnector != null} />
        {notificationConnector != null ? null :
            (
                <p className="NotificationConnectorItem-Explanation">Explanation Text</p>
            )}
        <div className="NotificationConnectorItem-Headers">
            {notificationConnector
                ? notificationConnector.headers.map((h: Record<string, string>) =>
                    (<HeaderElement record={h} />)
                ) :
                (
                    <button className="NotificationConnectorItem-AddHeader" onClick={AddHeader}>Add Header</button>
                )
            }
            {headerElements}
        </div>
        {notificationConnector != null ? null : (
            <button className="NotificationConnectorItem-Save" onClick={Save}>Save</button>
        )}
    </div>);
}

function HeaderElement({record} : {record: Record<string, string> | null}) : ReactElement {
    return <div className="NotificationConnectorItem-Header" key={"newHeader"}>
        <input type="text" className="NotificationConnectorItem-Header-Key" placeholder="Header-Key" value={record ? record.name : ""} disabled={record != null} />
        <input type="text" className="NotificationConnectorItem-Header-Value" placeholder="Header-Value" value={record ? record.value : ""} disabled={record != null} />
    </div>;
}