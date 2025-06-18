import IBackendSettings from "../../api/types/IBackendSettings";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    ColorPaletteProp,
    Input, Stack
} from "@mui/joy";
import {KeyboardEventHandler, useCallback, useContext, useEffect, useState} from "react";
import {ApiUriContext} from "../../api/fetchApi.tsx";
import {
    ResetFlareSolverrUrl,
    SetFlareSolverrUrl, TestFlareSolverrUrl,
} from "../../api/BackendSettings.tsx";

export default function FlareSolverr({backendSettings}: {backendSettings?: IBackendSettings}) {
    const apiUri = useContext(ApiUriContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [value, setValue] = useState<string>(backendSettings?.flareSolverrUrl??"");
    const [color, setColor] = useState<ColorPaletteProp>("neutral");

    const keyDown : KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
        if(value === undefined) return;
        if(e.key === "Enter") {
            setLoading(true);
            SetFlareSolverrUrl(apiUri, value)
                .then(() => setColor("success"))
                .catch(() => setColor("danger"))
                .finally(() => setLoading(false));
        }
    }, [apiUri, value])

    const Reset = useCallback(() => {
        setLoading(true);
        ResetFlareSolverrUrl(apiUri)
            .then(() => Test())
            .catch(() => setColor("danger"))
            .finally(() => setLoading(false));
    }, [apiUri]);
    
    const Test = useCallback(() => {
        setLoading(true);
        TestFlareSolverrUrl(apiUri)
            .then(() => setColor("success"))
            .catch(() => setColor("danger"))
            .finally(() => setLoading(false));
    }, [apiUri]);

    useEffect(() => {
        setValue(backendSettings?.flareSolverrUrl??"");
    }, [backendSettings]);

    return (
        <Accordion>
            <AccordionSummary>FlareSolverr</AccordionSummary>
            <AccordionDetails>
                <Input disabled={backendSettings === undefined || loading}
                       placeholder={"FlareSolverr URL"}
                       value={value}
                       onKeyDown={keyDown}
                       onChange={e => setValue(e.target.value)}
                       color={color}
                       endDecorator={<Stack direction={"row"} spacing={1}>
                           <Button onClick={Reset} loading={loading}>Reset</Button>
                           <Button onClick={Test} loading={loading}>Test</Button>
                       </Stack>}
                />
            </AccordionDetails>
        </Accordion>
    );
}