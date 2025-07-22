import ModalClose from '@mui/joy/ModalClose';
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary, Button, ColorPaletteProp,
    DialogContent,
    DialogTitle, Input,
    Link, Modal, ModalDialog, Stack
} from "@mui/joy";
import './Settings.css';
import * as React from "react";
import {createContext, Dispatch, useContext, useEffect, useState} from "react";
import {Article} from '@mui/icons-material';
import {TrangaSettings} from "../../apiClient/data-contracts.ts";
import {ApiContext} from "../../apiClient/ApiContext.tsx";
import NotificationConnectors from "./AddNotificationConnector.tsx";
import {SxProps} from "@mui/joy/styles/types";

export const SettingsContext = createContext<TrangaSettings>({});

export default function Settings({setApiUri} : {setApiUri: Dispatch<React.SetStateAction<string>>}) {
    const Api = useContext(ApiContext);
    const [settings, setSettings] = useState<TrangaSettings>({});

    const [open, setOpen] = React.useState(false);
    
    const [apiUriColor, setApiUriColor] = useState<ColorPaletteProp>("neutral");
    const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const [apiUriAccordionOpen, setApiUriAccordionOpen] = React.useState(true);

    useEffect(() => {
        Api.settingsList().then((response) => {
            setSettings(response.data)
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
    
    const [notificationConnectorsOpen, setNotificationConnectorsOpen] = React.useState(false);
    
    const ModalStyle : SxProps = {
        width: "80%",
        height: "80%"
    }
    
    return (
        <SettingsContext value={settings}>
            <Button onClick={() => setOpen(true)}>Settings</Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog sx={ModalStyle}>
                    <ModalClose />
                    <DialogTitle>Settings</DialogTitle>
                    <DialogContent>
                        <AccordionGroup>
                            <Accordion expanded={apiUriAccordionOpen} onChange={(_e, expanded) => setApiUriAccordionOpen(expanded)}>
                                <AccordionSummary>ApiUri</AccordionSummary>
                                <AccordionDetails>
                                    <Input
                                        color={apiUriColor}
                                        placeholder={"http(s)://"}
                                        type={"url"}
                                        defaultValue={Api.baseUrl}
                                        onChange={apiUriChanged} />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <Button onClick={() => setNotificationConnectorsOpen(true)}>Add Notification Connector</Button>
                                <NotificationConnectors open={notificationConnectorsOpen} setOpen={setNotificationConnectorsOpen} />
                            </Accordion>
                        </AccordionGroup>
                        <Stack spacing={2} direction="row">
                            <Link target={"_blank"} href={Api.baseUrl + "/swagger"}><Article />Swagger Doc</Link>
                        </Stack>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </SettingsContext>
    );
}