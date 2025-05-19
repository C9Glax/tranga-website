import Sheet from '@mui/joy/Sheet';
import './App.css'
import Settings from "./Settings.tsx";
import Header from "./Header.tsx";
import {Badge, Button} from "@mui/joy";
import {useEffect, useState} from "react";
import {ApiUriContext} from "./api/fetchApi.tsx";
import Search from './Components/Search.tsx';
import MangaList from "./Components/MangaList.tsx";
import {MangaConnectorContext} from "./api/Contexts/MangaConnectorContext.tsx";
import IMangaConnector from "./api/types/IMangaConnector.ts";
import {GetAllConnectors} from "./api/MangaConnector.tsx";

export default function App () {

    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [apiConnected, setApiConnected] = useState<boolean>(false);

    const apiUriStr = localStorage.getItem("apiUri") ?? window.location.href.substring(0, window.location.href.lastIndexOf("/"));

    const [apiUri, setApiUri] = useState<string>(apiUriStr);

    useEffect(() => {
        localStorage.setItem("apiUri", apiUri);
    }, [apiUri]);

    const [mangaConnectors, setMangaConnectors] = useState<IMangaConnector[]>([]);

    useEffect(() => {
        if(!apiConnected) return;
        GetAllConnectors(apiUri).then(setMangaConnectors);
    }, [apiConnected]);

    return (
        <ApiUriContext.Provider value={apiUri}>
            <MangaConnectorContext value={mangaConnectors}>
                <Sheet className={"app"}>
                    <Header>
                        <Badge color={"danger"} invisible={apiConnected} badgeContent={"!"}>
                            <Button onClick={() => setShowSettings(true)}>Settings</Button>
                        </Badge>
                    </Header>
                    <Settings open={showSettings} setOpen={setShowSettings} setApiUri={setApiUri} setConnected={setApiConnected} />
                    <Search open={showSearch} setOpen={setShowSearch} />
                    <Sheet className={"app-content"}>
                        <MangaList connected={apiConnected} setShowSearch={setShowSearch} />
                    </Sheet>
                </Sheet>
            </MangaConnectorContext>
        </ApiUriContext.Provider>
    );
}
