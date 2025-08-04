import {ReactNode, useCallback, useContext, useState} from "react";
import {SettingsContext} from "./Settings.tsx";
import {Button, Card, ColorPaletteProp, Slider, Typography} from "@mui/joy";
import * as React from "react";
import {ApiContext} from "../../apiClient/ApiContext.tsx";

export default function () : ReactNode {
    const settings = useContext(SettingsContext);
    const Api = useContext(ApiContext);

    const [value, setValue] = useState(settings?.imageCompression??100);
    const [color, setColor] = useState<ColorPaletteProp>("neutral");
    const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const valueChanged = (_: Event, val: number | number[]) => {
        clearTimeout(timerRef.current);
        setColor("warning");
        setValue(val as number);
        timerRef.current = setTimeout(() => {
            changeUri();
        }, 1000);
    }

    const changeUri = useCallback(()  => {
        Api.settingsImageCompressionLevelPartialUpdate(value)
            .then(response => {
                if (response.ok)
                    setColor("success");
                else
                    setColor("danger");
            })
            .catch(() => setColor("danger"));
    }, [value]);
    
    return (
        <Card>
            <Typography>Image Compression</Typography>
            <Slider sx={{marginTop: "20px"}} valueLabelDisplay={"auto"} value={value} onChange={valueChanged} color={color} />
            <Button onClick={changeUri}>Set</Button>
        </Card>
    );
}