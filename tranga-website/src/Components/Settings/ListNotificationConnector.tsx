import {ApiContext} from "../../apiClient/ApiContext.tsx";
import {useContext, useEffect, useState} from "react";
import { NotificationConnector } from "../../apiClient/data-contracts.ts";
import {Card, Chip, Input, Stack, Table, Textarea, Typography} from "@mui/joy";

export default function (){
    const Api = useContext(ApiContext);
    const [notificationConnectors, setNotificationConnectors] = useState<NotificationConnector[]>([]);

    useEffect(() => {
        getConnectors();
    }, []);

    const getConnectors = () => {
        Api.notificationConnectorList().then(r => {
            if(r.ok)
                setNotificationConnectors(r.data);
        })
    };

    return (
        <Stack direction={"column"} spacing={1}>
            {notificationConnectors.map(c => <NotificationConnectorItem key={c.name} connector={c} />)}
        </Stack>
    );
}

function NotificationConnectorItem({connector} : {connector: NotificationConnector}){
    return (
        <Card>
            <Typography left={"h2"}>{connector.name}</Typography>
            <Input disabled startDecorator={<Chip>{connector.httpMethod}</Chip>} value={connector.url} />
            <Table>
                <thead>
                    <tr>
                        <th>Header</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                {Object.entries(connector.headers).map(x =>
                    <tr key={x[0]}>
                        <td>{x[0]}</td>
                        <td>{[x[1]]}</td>
                    </tr>
                )}
                </tbody>
            </Table>
            <Textarea disabled value={connector.body}/>
        </Card>
    );
}