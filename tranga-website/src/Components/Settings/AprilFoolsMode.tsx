import IBackendSettings from "../../api/types/IBackendSettings.ts";
import {useCallback, useContext, useState} from "react";
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
import {UpdateAprilFoolsToggle} from "../../api/BackendSettings.tsx";

export default function ImageProcessing({backendSettings}: {backendSettings?: IBackendSettings}) {
    const apiUri = useContext(ApiUriContext);

    const [loading, setLoading] = useState<boolean>(false);
    const [color, setColor] = useState<ColorPaletteProp>("neutral");

    const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const valueChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        setColor("warning");
        clearTimeout(timerRef.current);
        console.log(e);
        timerRef.current = setTimeout(() => {
            UpdateAprilFoolsMode(e.target.checked);
        }, 1000);
    }

    const UpdateAprilFoolsMode = useCallback((value: boolean) => {
        UpdateAprilFoolsToggle(apiUri, value)
            .then(() => setColor("success"))
            .catch(() => setColor("danger"))
            .finally(() => setLoading(false));
    }, [apiUri]);

    return (
        <Accordion>
            <AccordionSummary>April Fools Mode</AccordionSummary>
            <AccordionDetails>
                <Typography endDecorator={
                    <Switch disabled={backendSettings === undefined || loading}
                            onChange={valueChanged}
                            color={color}
                            defaultChecked={backendSettings?.aprilFoolsMode} />
                }>
                    Toggle
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}