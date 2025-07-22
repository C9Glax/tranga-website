import {ReactNode, useContext, useState} from "react";
import {SettingsContext, SettingsItem} from "./Settings.tsx";
import {ApiContext} from "../../apiClient/ApiContext.tsx";
import {ColorPaletteProp, Input} from "@mui/joy";
import * as React from "react";

export default function () : ReactNode {
    const settings = useContext(SettingsContext);
    const Api = useContext(ApiContext);

    const [color, setColor] = useState<ColorPaletteProp>("neutral");
    const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const languageChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timerRef.current);
        setColor("warning");
        timerRef.current = setTimeout(() => {
            Api.settingsDownloadLanguagePartialUpdate(e.target.value)
                .then(response => {
                    if (response.ok)
                        setColor("success");
                    else
                        setColor("danger");
                })
                .catch(() => setColor("danger"));
        }, 1000);
    }

    return (
        <SettingsItem title={"Download Language"}>
            <Input color={color} value={settings?.downloadLanguage as string} placeholder={"Language code (f.e. 'en')"} onChange={languageChanged} />
        </SettingsItem>
    );
}