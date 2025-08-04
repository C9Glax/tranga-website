import {ReactNode, useCallback, useContext, useState} from "react";
import {SettingsContext} from "./Settings.tsx";
import {Button, Card, ColorPaletteProp, Input, Typography} from "@mui/joy";
import * as React from "react";
import {ApiContext} from "../../apiClient/ApiContext.tsx";

export default function () : ReactNode {
    const settings = useContext(SettingsContext);
    const Api = useContext(ApiContext);

    const [uriValue, setUriValue] = React.useState<string>(settings?.flareSolverrUrl as string);
    const [uriColor, setUriColor] = useState<ColorPaletteProp>("neutral");
    const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const uriChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timerRef.current);
        setUriValue(e.target.value);
        setUriColor("warning");
        timerRef.current = setTimeout(() => {
            changeUri();
        }, 1000);
    }

    const changeUri = useCallback(()  => {
        Api.settingsFlareSolverrUrlCreate(uriValue)
            .then(response => {
                if (response.ok)
                    setUriColor("success");
                else
                    setUriColor("danger");
            })
            .catch(() => setUriColor("danger"));
    }, [uriValue]);
    
    return (
        <Card>
            <Typography>FlareSolverr</Typography>
            <Input color={uriColor} value={uriValue} type={"url"} placeholder={"URL"} onChange={uriChanged}
                   endDecorator={<Button onClick={changeUri}>Apply</Button>}
            />
        </Card>
    );
}