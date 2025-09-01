import {Button, Card, Typography} from "@mui/joy";
import {useState} from "react";
import ListLibraryConnectors from "./ListLibraryConnectors.tsx";
import AddLibraryConnector from "./AddLibraryConnector.tsx";

export default function (){

    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);

    return (
        <Card>
            <Typography>Library Connectors</Typography>
            <Button onClick={() => setAddDialogOpen(true)}>Add</Button>
            <ListLibraryConnectors />
            <AddLibraryConnector open={addDialogOpen} setOpen={() => setAddDialogOpen(false)} />
        </Card>
    );
}