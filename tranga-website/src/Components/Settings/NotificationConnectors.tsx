import {ReactNode} from "react";
import {SettingsItem} from "./Settings.tsx";
import {Button} from "@mui/joy";
import NotificationConnectors from "./AddNotificationConnector.tsx";
import * as React from "react";

export default function () : ReactNode {
    const [notificationConnectorsOpen, setNotificationConnectorsOpen] = React.useState(false);
    
    return (
        <SettingsItem title={"Notification Connectors"}>
            <Button onClick={() => setNotificationConnectorsOpen(true)}>Add Notification Connector</Button>
            <NotificationConnectors open={notificationConnectorsOpen} setOpen={setNotificationConnectorsOpen} />
        </SettingsItem>
    );
}