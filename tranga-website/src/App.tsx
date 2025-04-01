import Sheet from '@mui/joy/Sheet';
import './App.css'
import Settings from "./Settings.tsx";
import Header from "./Header.tsx";
import {Badge, Button} from "@mui/joy";
import {useState} from "react";
import {ApiUriContext} from "./api/fetchApi.tsx";
import Search from './Components/Search.tsx';

export default function App () {

    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [apiConnected, setApiConnected] = useState<boolean>(false);

    const [apiUri, setApiUri] = useState<string>(window.location.href.substring(0, window.location.href.lastIndexOf("/")));

    return (
        <ApiUriContext.Provider value={apiUri}>
            <Sheet className={"app"}>
                <Header>
                    <Badge color={"danger"} invisible={apiConnected} badgeContent={"!"}>
                        <Button onClick={() => setShowSettings(true)}>Settings</Button>
                    </Badge>
                    <Button onClick={() => setShowSearch(true)}>Search</Button>
                </Header>
                <Settings open={showSettings} setOpen={setShowSettings} setApiUri={setApiUri} setConnected={setApiConnected} />
                <Search open={showSearch} setOpen={setShowSearch} />
                <Sheet className={"app-content"}>

                </Sheet>
            </Sheet>
        </ApiUriContext.Provider>
    );
}
