import Drawer from '@mui/joy/Drawer';
import ModalClose from '@mui/joy/ModalClose';
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary, CircularProgress, ColorPaletteProp,
    DialogContent,
    DialogTitle, Input
} from "@mui/joy";
import './Settings.css';
import * as React from "react";
import {useCallback, useContext, useEffect, useState} from "react";
import {ApiUriContext} from "./api/fetchApi.tsx";
import IBackendSettings from "./api/types/IBackendSettings.ts";
import { GetSettings } from './api/BackendSettings.tsx';
import UserAgent from "./Components/Settings/UserAgent.tsx";
import ImageProcessing from "./Components/Settings/ImageProcessing.tsx";
import ChapterNamingScheme from "./Components/Settings/ChapterNamingScheme.tsx";
import AprilFoolsMode from './Components/Settings/AprilFoolsMode.tsx';
import RequestLimits from "./Components/Settings/RequestLimits.tsx";

const checkConnection  = async (apiUri: string): Promise<boolean> =>{
    return fetch(`${apiUri}/swagger/v2/swagger.json`,
        {
            method: 'GET',
        })
        .then((response) => {
            if(!(response.ok && response.status == 200))
                return false;
            return response.json().then((json) => (json as {openapi:string}).openapi.match("[0-9]+(?:\.[0-9]+)+")?true:false).catch(() => false);
        })
        .catch(() => {
            return false;
        });
}

export default function Settings({open, setOpen, setApiUri, setConnected}:{open:boolean, setOpen:React.Dispatch<React.SetStateAction<boolean>>, setApiUri:React.Dispatch<React.SetStateAction<string>>, setConnected:React.Dispatch<React.SetStateAction<boolean>>}) {

    const apiUri = useContext(ApiUriContext);

    const [apiUriColor, setApiUriColor] = useState<ColorPaletteProp>("neutral");
    const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

    const [apiUriAccordionOpen, setApiUriAccordionOpen] = React.useState(true);
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        OnCheckConnection(apiUri);
    }, []);

    const apiUriChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timerRef.current);
        setApiUriColor("warning");
        timerRef.current = setTimeout(() => {
            OnCheckConnection(e.target.value);
        }, 1000);
    }

    const OnCheckConnection = (uri: string) => {
        console.log("Checking connection...");
        setChecking(true);
        checkConnection(uri)
            .then((result) => {
                setConnected(result);
                if(result)
                    console.log("Connected!");
                setApiUriAccordionOpen(!result);
                setApiUriColor(result ? "success" : "danger");
                if(result)
                    setApiUri(uri);
            })
            .finally(() => setChecking(false));
    }

    const [backendSettings, setBackendSettings] = useState<IBackendSettings>();

    const getBackendSettings = useCallback(() => {
        GetSettings(apiUri).then(setBackendSettings);
    }, [apiUri]);

    useEffect(() => {
        getBackendSettings();
    }, [checking]);

    return (
        <Drawer size={"lg"} open={open} onClose={() => setOpen(false)}>
            <ModalClose />
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
                <AccordionGroup>
                    <Accordion expanded={apiUriAccordionOpen} onChange={(_e, expanded) => setApiUriAccordionOpen(expanded)}>
                        <AccordionSummary>ApiUri</AccordionSummary>
                        <AccordionDetails>
                            <Input
                                disabled={checking}
                                color={apiUriColor}
                                placeholder={"http(s)://"}
                                type={"url"}
                                defaultValue={apiUri}
                                onChange={apiUriChanged}
                                onKeyDown={(e) => {
                                    if(e.key === "Enter") {
                                        clearTimeout(timerRef.current);
                                        OnCheckConnection(e.currentTarget.value);
                                    }
                                }}
                                endDecorator={(checking ? <CircularProgress color={apiUriColor} size={"sm"} /> : null)} />
                        </AccordionDetails>
                    </Accordion>
                    <UserAgent backendSettings={backendSettings} />
                    <ImageProcessing backendSettings={backendSettings} />
                    <ChapterNamingScheme backendSettings={backendSettings} />
                    <AprilFoolsMode backendSettings={backendSettings} />
                    <RequestLimits backendSettings={backendSettings} />
                </AccordionGroup>
            </DialogContent>
        </Drawer>
    );
}