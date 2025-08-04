import ModalClose from '@mui/joy/ModalClose';
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary, Button, ColorPaletteProp,
    DialogContent,
    DialogTitle, Input,
    Modal, ModalDialog, Stack
} from "@mui/joy";
import './Settings.css';
import * as React from "react";
import {createContext, Dispatch, ReactNode, useContext, useEffect, useState} from "react";
import {TrangaSettings} from "../../apiClient/data-contracts.ts";
import {ApiContext} from "../../apiClient/ApiContext.tsx";
import {SxProps} from "@mui/joy/styles/types";
import Maintenance from "./Maintenance.tsx";
import Services from "./Services.tsx";
import Download from './Download.tsx';

export const SettingsContext = createContext<TrangaSettings|undefined>(undefined);

export default function Settings({setApiUri} : {setApiUri: Dispatch<React.SetStateAction<string>>}) {
    const Api = useContext(ApiContext);
    const [settings, setSettings] = useState<TrangaSettings>();

    const [open, setOpen] = React.useState(false);
    
    const [apiUriColor, setApiUriColor] = useState<ColorPaletteProp>("neutral");
    const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        Api.settingsList().then((response) => {
            setSettings(response.data);
        });
    }, []);

    const apiUriChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timerRef.current);
        setApiUriColor("warning");
        timerRef.current = setTimeout(() => {
            setApiUri(e.target.value);
            setApiUriColor("success");
        }, 1000);
    }
    
    const ModalStyle : SxProps = {
        width: "80%",
        height: "80%"
    }
    
    return (
        <SettingsContext.Provider value={settings}>
            <Button onClick={() => setOpen(true)}>Settings</Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog sx={ModalStyle}>
                    <ModalClose />
                    <DialogTitle>Settings</DialogTitle>
                    <DialogContent>
                        <AccordionGroup>
                            <SettingsItem title={"ApiUri"}>
                                <Input
                                    color={apiUriColor}
                                    placeholder={"http(s)://"}
                                    type={"url"}
                                    defaultValue={Api.baseUrl}
                                    onChange={apiUriChanged} />
                            </SettingsItem>
                            <Download />
                            <Services />
                            <Maintenance />
                        </AccordionGroup>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </SettingsContext.Provider>
    );
}

export function SettingsItem({title, children, defaultExpanded, direction} : {title: string, children?: ReactNode, defaultExpanded?: boolean, direction?: "row" | "column"}) {
    const [expanded, setExpanded] = React.useState(defaultExpanded??false);
    const stackDirection = direction ?? "column";

    return (
        <Accordion expanded={expanded} onChange={(_, expanded) => setExpanded(expanded)}>
            <AccordionSummary>{title}</AccordionSummary>
            <AccordionDetails>
                <Stack direction={stackDirection} spacing={1}>
                    {children}
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}