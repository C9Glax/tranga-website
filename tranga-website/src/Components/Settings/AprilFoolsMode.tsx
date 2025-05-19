import IBackendSettings from "../../api/types/IBackendSettings.ts";
import {useCallback, useContext, useEffect, useState} from "react";
import {ApiUriContext} from "../../api/fetchApi.tsx";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    ColorPaletteProp,
    Switch,
    Typography
} from "@mui/joy";
import * as React from "react";
import {GetAprilFoolsToggle, UpdateAprilFoolsToggle} from "../../api/BackendSettings.tsx";

export default function ImageProcessing({backendSettings}: {backendSettings?: IBackendSettings}) {
    const apiUri = useContext(ApiUriContext);

    const [loading, setLoading] = useState<boolean>(false);
    const [color, setColor] = useState<ColorPaletteProp>("neutral");
    const [value, setValue] = useState<boolean>(backendSettings?.aprilFoolsMode??false);

    const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const valueChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        setColor("warning");
        clearTimeout(timerRef.current);
        console.log(e);
        timerRef.current = setTimeout(() => {
            UpdateAprilFoolsMode(e.target.checked);
        }, 1000);
    }

    useEffect(() => {
        setValue(backendSettings?.aprilFoolsMode??false);
    }, [backendSettings]);

    const UpdateAprilFoolsMode = useCallback((value: boolean) => {
        UpdateAprilFoolsToggle(apiUri, value)
            .then(() => GetAprilFoolsToggle(apiUri))
            .then((val) => setValue(val))
            .then(() => setColor("success"))
            .catch(() => setColor("danger"))
            .finally(() => setLoading(false));
    }, [apiUri, value]);

    return (
        <Accordion>
            <AccordionSummary>April Fools Mode</AccordionSummary>
            <AccordionDetails>
                <Typography endDecorator={
                    <Switch disabled={backendSettings === undefined || loading}
                            onChange={valueChanged}
                            color={color}
                            checked={value} />
                }>
                    Toggle
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}