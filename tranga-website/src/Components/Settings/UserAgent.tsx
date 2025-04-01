import IBackendSettings from "../../api/types/IBackendSettings";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    ColorPaletteProp,
    Input
} from "@mui/joy";
import {KeyboardEventHandler, useCallback, useContext, useState} from "react";
import {ApiUriContext} from "../../api/fetchApi.tsx";
import {ResetUserAgent, UpdateUserAgent} from "../../api/BackendSettings.tsx";

export default function UserAgent({backendSettings}: {backendSettings?: IBackendSettings}) {
    const apiUri = useContext(ApiUriContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const [color, setColor] = useState<ColorPaletteProp>("neutral");

    const keyDown : KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
        if(e.key === "Enter") {
            setLoading(true);
            UpdateUserAgent(apiUri, value)
                .then(() => setColor("success"))
                .catch(() => setColor("danger"))
                .finally(() => setLoading(false));
        }
    }, [apiUri])

    const Reset = useCallback(() => {
        setLoading(true);
        ResetUserAgent(apiUri)
            .then(() => setColor("success"))
            .catch(() => setColor("danger"))
            .finally(() => setLoading(false));
    }, [apiUri]);

    return (
        <Accordion>
            <AccordionSummary>UserAgent</AccordionSummary>
            <AccordionDetails>
                <Input disabled={backendSettings === undefined || loading}
                        placeholder={"UserAgent"}
                        defaultValue={backendSettings?.userAgent}
                        onKeyDown={keyDown}
                        onChange={e => setValue(e.target.value)}
                        color={color}
                       endDecorator={<Button onClick={Reset} loading={loading}>Reset</Button>}
                />
            </AccordionDetails>
        </Accordion>
    );
}