import {SettingsItem} from "./Settings.tsx";
import NotificationConnectors from "./NotificationConnectors/AddNotificationConnector.tsx";
import FlareSolverr from "./FlareSolverr.tsx";
import LibraryConnectors from "./LibraryConnectors/LibraryConnectors.tsx";

export default function(){



    return (
        <SettingsItem title={"Services"} direction={"row"}>
            <FlareSolverr />
            <NotificationConnectors />
            <LibraryConnectors />
        </SettingsItem>
    );
}