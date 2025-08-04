import {SettingsItem} from "./Settings.tsx";
import NotificationConnectors from "./AddNotificationConnector.tsx";
import FlareSolverr from "./FlareSolverr.tsx";

export default function(){



    return (
        <SettingsItem title={"Services"} direction={"row"}>
            <FlareSolverr />
            <NotificationConnectors />
        </SettingsItem>
    );
}