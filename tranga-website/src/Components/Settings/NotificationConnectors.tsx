import {ReactNode, useContext, useState} from "react";
import { ApiContext } from "../../apiClient/ApiContext";
import {Button, Input, Modal, ModalDialog, Tab, TabList, TabPanel, Tabs} from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import {GotifyRecord, NtfyRecord, PushoverRecord} from "../../apiClient/data-contracts.ts";

export default function ({open, setOpen} : {open: boolean, setOpen: (open: boolean) => void}) {
        
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog>
                <ModalClose />
                <Tabs sx={{width:'95%'}} defaultValue={"gotify"}>
                    <TabList>
                        <Tab value={"gotify"}>Gotify</Tab>
                        <Tab value={"ntfy"}>Ntfy</Tab>
                        <Tab value={"pushover"}>Pushover</Tab>
                    </TabList>
                    <Gotify />
                    <Ntfy />
                    <Pushover />
                </Tabs>
            </ModalDialog>
        </Modal>
    );
}

function NotificationConnectorTab({ value, children, add }: { value: string, children: ReactNode, add: (data: any) => void }) {
    return (
        <TabPanel value={value}>
            {children}
            <Button onClick={add}>Add</Button>
        </TabPanel>
    );
}

function Gotify() {
    const Api = useContext(ApiContext);
    const [gotifyData, setGotifyData] = useState<GotifyRecord>({});
    
    return (
        <NotificationConnectorTab value={"gotify"} add={() => Api.notificationConnectorGotifyUpdate(gotifyData)}>
            <Input placeholder={"Name"} value={gotifyData.name as string} onChange={(e) => setGotifyData({...gotifyData, name: e.target.value})} />
            <Input placeholder={"https://[...]/message"} value={gotifyData.endpoint as string} onChange={(e) => setGotifyData({...gotifyData, endpoint: e.target.value})} />
            <Input placeholder={"Apptoken"} type={"password"} value={gotifyData.appToken as string} onChange={(e) => setGotifyData({...gotifyData, appToken: e.target.value})} />
            <Input placeholder={"Priority"} type={"number"} value={gotifyData.priority as number} onChange={(e) => setGotifyData({...gotifyData, priority: e.target.valueAsNumber})} />
        </NotificationConnectorTab>
    );
}

function Ntfy() {
    const Api = useContext(ApiContext);
    const [ntfyData, setNtfyData] = useState<NtfyRecord>({});

    return (
        <NotificationConnectorTab value={"ntfy"} add={() => Api.notificationConnectorNtfyUpdate(ntfyData)}>
            <Input placeholder={"Name"} value={ntfyData.name as string} onChange={(e) => setNtfyData({...ntfyData, name: e.target.value})} />
            <Input placeholder={"Endpoint"} value={ntfyData.endpoint as string} onChange={(e) => setNtfyData({...ntfyData, endpoint: e.target.value})} />
            <Input placeholder={"Topic"} value={ntfyData.topic as string} onChange={(e) => setNtfyData({...ntfyData, topic: e.target.value})} />
            <Input placeholder={"Username"} value={ntfyData.username as string} onChange={(e) => setNtfyData({...ntfyData, username: e.target.value})} />
            <Input placeholder={"Password"} type={"password"} value={ntfyData.password as string} onChange={(e) => setNtfyData({...ntfyData, password: e.target.value})} />
            <Input placeholder={"Priority"} type={"number"} value={ntfyData.priority as number} onChange={(e) => setNtfyData({...ntfyData, priority: e.target.valueAsNumber})} />
        </NotificationConnectorTab>
    );
}

function Pushover() {
    const Api = useContext(ApiContext);
    const [pushoverData, setPushoverData] = useState<PushoverRecord>({});

    return (
        <NotificationConnectorTab value={"pushover"} add={() => Api.notificationConnectorPushoverUpdate(pushoverData)}>
            <Input placeholder={"Name"} value={pushoverData.name as string} onChange={(e) => setPushoverData({...pushoverData, name: e.target.value})} />
            <Input placeholder={"User"} value={pushoverData.user as string} onChange={(e) => setPushoverData({...pushoverData, user: e.target.value})} />
            <Input placeholder={"AppToken"} type={"password"} value={pushoverData.appToken as string} onChange={(e) => setPushoverData({...pushoverData, appToken: e.target.value})} />
        </NotificationConnectorTab>
    );
}