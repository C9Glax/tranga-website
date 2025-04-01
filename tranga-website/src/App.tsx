import Sheet from '@mui/joy/Sheet';
import './App.css'
import Settings from "./Settings.tsx";
import Header from "./Header.tsx";
import {Badge, Button, Card, CardContent, CardCover, Typography} from "@mui/joy";
import {useState} from "react";
import {ApiUriContext} from "./api/fetchApi.tsx";
import Search from './Components/Search.tsx';
import MangaList from "./Components/MangaList.tsx";

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
                </Header>
                <Settings open={showSettings} setOpen={setShowSettings} setApiUri={setApiUri} setConnected={setApiConnected} />
                <Search open={showSearch} setOpen={setShowSearch} />
                <Sheet className={"app-content"}>
                    <MangaList>
                        <Card onClick={() => setShowSearch(true)} sx={{height:"400px", width:"300px"}}>
                            <CardCover>
                                <img src={"/blahaj.png"} />
                            </CardCover>
                            <CardCover sx={{
                                background: 'rgba(234, 119, 246, 0.14)',
                                backdropFilter: 'blur(6.9px)',
                                webkitBackdropFilter: 'blur(6.9px)',
                            }}/>
                            <CardContent>
                                <Typography level={"h1"}>Search</Typography>
                            </CardContent>
                        </Card>
                    </MangaList>
                </Sheet>
            </Sheet>
        </ApiUriContext.Provider>
    );
}
