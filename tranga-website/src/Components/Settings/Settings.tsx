import Drawer from '@mui/joy/Drawer';
import ModalClose from '@mui/joy/ModalClose';
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary, Button, ColorPaletteProp,
    DialogContent,
    DialogTitle, Input,
    Link, Stack
} from "@mui/joy";
import './Settings.css';
import * as React from "react";
import {createContext, Dispatch, useContext, useEffect, useState} from "react";
import {Article} from '@mui/icons-material';
import {TrangaSettings} from "../../apiClient/data-contracts.ts";
import {ApiContext} from "../../apiClient/ApiContext.tsx";
import NotificationConnectors from "./NotificationConnectors.tsx";

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
    
    return (
        <SettingsContext value={settings}>
            <Button onClick={() => setOpen(true)}>Settings</Button>
            <Drawer size={"lg"} open={open} onClose={() => setOpen(false)}>
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
            </Drawer>
        </SettingsContext>
    );
}