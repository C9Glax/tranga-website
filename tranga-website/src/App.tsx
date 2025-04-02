import Sheet from '@mui/joy/Sheet';
import './App.css'
import Settings from "./Settings.tsx";
import Header from "./Header.tsx";
import {Badge, Box, Button, Card, CardContent, CardCover, Typography} from "@mui/joy";
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
                    <MangaList connected={apiConnected}>
                        <Badge invisible>
                            <Card onClick={() => setShowSearch(true)} sx={{height:"fit-content",width:"fit-content"}}>
                                <CardCover sx={{margin:"var(--Card-padding)"}}>
                                    <img src={"/blahaj.png"} style={{height:"400px", width:"300px"}} />
                                </CardCover>
                                <CardCover sx={{
                                    background: 'rgba(234, 119, 246, 0.14)',
                                    backdropFilter: 'blur(6.9px)',
                                    webkitBackdropFilter: 'blur(6.9px)',
                                }}/>
                                <CardContent>
                                    <Box style={{height:"400px", width:"300px"}} >
                                        <Typography level={"h1"}>Search</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Badge>
                    </MangaList>
                </Sheet>
            </Sheet>
        </ApiUriContext.Provider>
    );
}
