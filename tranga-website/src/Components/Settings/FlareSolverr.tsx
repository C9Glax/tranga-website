import {ReactNode, useContext, useState} from "react";
import {SettingsContext, SettingsItem} from "./Settings.tsx";
import {ColorPaletteProp, Input} from "@mui/joy";
import * as React from "react";
import {ApiContext} from "../../apiClient/ApiContext.tsx";

export default function () : ReactNode {
    const settings = useContext(SettingsContext);
    const Api = useContext(ApiContext);

    const [uriColor, setUriColor] = useState<ColorPaletteProp>("neutral");
    const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const uriChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timerRef.current);
        setUriColor("warning");
        timerRef.current = setTimeout(() => {
            Api.settingsFlareSolverrUrlCreate(e.target.value)
                .then(response => {
                    if (response.ok)
                        setUriColor("success");
                    else
                        setUriColor("danger");
                })
                .catch(() => setUriColor("danger"));
        }, 1000);
    }
    
    return (
        <SettingsItem title={"FlareSolverr"}>
            <Input color={uriColor} value={settings?.flareSolverrUrl as string} type={"url"} placeholder={"URL"} onChange={uriChanged} />
        </SettingsItem>
    );
}