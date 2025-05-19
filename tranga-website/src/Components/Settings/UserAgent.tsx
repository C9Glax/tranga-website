import IBackendSettings from "../../api/types/IBackendSettings";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    ColorPaletteProp,
    Input
} from "@mui/joy";
import {KeyboardEventHandler, useCallback, useContext, useEffect, useState} from "react";
import {ApiUriContext} from "../../api/fetchApi.tsx";
import {GetUserAgent, ResetUserAgent, UpdateUserAgent} from "../../api/BackendSettings.tsx";

export default function UserAgent({backendSettings}: {backendSettings?: IBackendSettings}) {
    const apiUri = useContext(ApiUriContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [value, setValue] = useState<string>(backendSettings?.userAgent??"");
    const [color, setColor] = useState<ColorPaletteProp>("neutral");

    const keyDown : KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
        if(value === undefined) return;
        if(e.key === "Enter") {
            setLoading(true);
            UpdateUserAgent(apiUri, value)
                .then(() => setColor("success"))
                .catch(() => setColor("danger"))
                .finally(() => setLoading(false));
        }
    }, [apiUri, value])

    const Reset = useCallback(() => {
        setLoading(true);
        ResetUserAgent(apiUri)
            .then(() => GetUserAgent(apiUri))
            .then((val) => setValue(val))
            .then(() => setColor("success"))
            .catch(() => setColor("danger"))
            .finally(() => setLoading(false));
    }, [apiUri]);

    useEffect(() => {
        setValue(backendSettings?.userAgent??"");
    }, [backendSettings]);

    return (
        <Accordion>
            <AccordionSummary>UserAgent</AccordionSummary>
            <AccordionDetails>
                <Input disabled={backendSettings === undefined || loading}
                       placeholder={"UserAgent"}
                       value={value}
                       onKeyDown={keyDown}
                       onChange={e => setValue(e.target.value)}
                       color={color}
                       endDecorator={<Button onClick={Reset} loading={loading}>Reset</Button>}
                />
            </AccordionDetails>
        </Accordion>
    );
}