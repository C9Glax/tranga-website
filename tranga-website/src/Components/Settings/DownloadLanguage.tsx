import {ReactNode, useContext, useState} from "react";
import {SettingsContext} from "./Settings.tsx";
import {ApiContext} from "../../apiClient/ApiContext.tsx";
import {Card, ColorPaletteProp, Input, Typography} from "@mui/joy";
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
        <Card>
            <Typography>Download Language</Typography>
            <Input color={color} defaultValue={settings?.downloadLanguage as string} placeholder={"Language code (f.e. 'en')"} onChange={languageChanged} />
        </Card>
    );
}