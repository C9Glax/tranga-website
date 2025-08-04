import {ReactNode, useContext, useState} from "react";
import { ApiContext } from "../../apiClient/ApiContext";
import {
    Button, Card,
    Input,
    Modal,
    ModalDialog,
    Stack,
    Tab,
    TabList,
    TabPanel,
    Tabs, Typography
} from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import {GotifyRecord, NtfyRecord, PushoverRecord} from "../../apiClient/data-contracts.ts";
import {LoadingState, StateColor, StateIndicator} from "../Loading.tsx";
import * as React from "react";

export default function () {
    const [notificationConnectorsOpen, setNotificationConnectorsOpen] = React.useState(false);
        
    return (
        <Card>
            <Typography>Notification Connectors</Typography>
            <Button onClick={() => setNotificationConnectorsOpen(true)}>Add</Button>
            <Modal open={notificationConnectorsOpen} onClose={() => setNotificationConnectorsOpen(false)}>
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
        </Card>
    );
}

function NotificationConnectorTab({ value, children, add, state }: { value: string, children: ReactNode, add: (data: any) => void, state: LoadingState }) {
    
    const IsLoading = (state : LoadingState) : boolean => state === LoadingState.loading;
    
    return (
        <TabPanel value={value}>
            <Stack spacing={1}>
                {children}
                <Button onClick={add} endDecorator={StateIndicator(state)} loading={IsLoading(state)} disabled={IsLoading(state)} color={StateColor(state)}>Add</Button>
            </Stack>
        </TabPanel>
    );
}

function Gotify() {
    const Api = useContext(ApiContext);
    const [gotifyData, setGotifyData] = useState<GotifyRecord>({});
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.none);

    const Add = () => {
        setLoadingState(LoadingState.loading);
        Api.notificationConnectorGotifyUpdate(gotifyData)
            .then((response) => {
                if (response.ok)
                    setLoadingState(LoadingState.success);
                else
                    setLoadingState(LoadingState.failure);
            })
            .catch(_ => setLoadingState(LoadingState.failure));
    }
    
    return (
        <NotificationConnectorTab value={"gotify"} add={Add} state={loadingState}>
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
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.none);

    const Add = () => {
        setLoadingState(LoadingState.loading);
        Api.notificationConnectorNtfyUpdate(ntfyData)
            .then((response) => {
                if (response.ok)
                    setLoadingState(LoadingState.success);
                else
                    setLoadingState(LoadingState.failure);
            })
            .catch(_ => setLoadingState(LoadingState.failure));
    }

    return (
        <NotificationConnectorTab value={"ntfy"} add={Add} state={loadingState}>
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
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.none);
    
    const Add = () => {
        setLoadingState(LoadingState.loading);
        Api.notificationConnectorPushoverUpdate(pushoverData)
            .then((response) => {
                if (response.ok)
                    setLoadingState(LoadingState.success);
                else
                    setLoadingState(LoadingState.failure);
            })
            .catch(_ => setLoadingState(LoadingState.failure));
    }

    return (
        <NotificationConnectorTab value={"pushover"} add={Add} state={loadingState}>
            <Input placeholder={"Name"} value={pushoverData.name as string} onChange={(e) => setPushoverData({...pushoverData, name: e.target.value})} />
            <Input placeholder={"User"} value={pushoverData.user as string} onChange={(e) => setPushoverData({...pushoverData, user: e.target.value})} />
            <Input placeholder={"AppToken"} type={"password"} value={pushoverData.appToken as string} onChange={(e) => setPushoverData({...pushoverData, appToken: e.target.value})} />
        </NotificationConnectorTab>
    );
}