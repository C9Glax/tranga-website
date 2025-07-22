import ModalClose from '@mui/joy/ModalClose';
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary, Button, ColorPaletteProp,
    DialogContent,
    DialogTitle, Input,
    Modal, ModalDialog
} from "@mui/joy";
import './Settings.css';
import * as React from "react";
import {createContext, Dispatch, ReactNode, useContext, useEffect, useState} from "react";
import {TrangaSettings} from "../../apiClient/data-contracts.ts";
import {ApiContext} from "../../apiClient/ApiContext.tsx";
import NotificationConnectors from "./NotificationConnectors.tsx";
import {SxProps} from "@mui/joy/styles/types";
import ImageCompression from "./ImageCompression.tsx";
import FlareSolverr from "./FlareSolverr.tsx";
import DownloadLanguage from "./DownloadLanguage.tsx";
import ChapterNamingScheme from "./ChapterNamingScheme.tsx";

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
                            <ImageCompression />
                            <FlareSolverr />
                            <DownloadLanguage />
                            <ChapterNamingScheme />
                            <NotificationConnectors />
                        </AccordionGroup>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </SettingsContext.Provider>
    );
}

export function SettingsItem({title, children} : {title: string, children: ReactNode}) {
    return (
        <Accordion>
            <AccordionSummary>{title}</AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}