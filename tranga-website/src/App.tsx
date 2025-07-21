import Sheet from '@mui/joy/Sheet';
import './App.css'
import Settings from "./Components/Settings/Settings.tsx";
import Header from "./Header.tsx";
import {createContext, useEffect, useState} from "react";
import {V2} from "./apiClient/V2.ts";
import {GetManga, MangaContext } from './apiClient/MangaContext.tsx';
import { ApiContext } from './apiClient/ApiContext.tsx';
import MangaList from "./Components/Mangas/MangaList.tsx";
import {MangaConnector} from "./apiClient/data-contracts.ts";

export const MangaConnectorContext = createContext<MangaConnector[]>([]);

export default function App () {
    const apiUriStr = localStorage.getItem("apiUri") ?? window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/api";
    const [apiUri, setApiUri] = useState<string>(apiUriStr);
    const [Api, setApi] = useState<V2>(new V2());

    const [mangaConnectors, setMangaConnectors] = useState<MangaConnector[]>([]);
    useEffect(() => {
        Api.mangaConnectorList().then(response => {
            if (response.ok)
                setMangaConnectors(response.data);
        })
    }, [Api]);
    
    
    useEffect(() => {
        localStorage.setItem("apiUri", apiUri);
        setApi(new V2({
            baseUrl: apiUri
        }));
    }, [apiUri]);

    return (
        <ApiContext.Provider value={Api}>
            <MangaConnectorContext.Provider  value={mangaConnectors}>
                <MangaContext.Provider value={{GetManga: GetManga}}>
                    <Sheet className={"app"}>
                        <Header>
                            <Settings setApiUri={setApiUri} />
                        </Header>
                        <Sheet className={"app-content"}>
                            <MangaList />
                        </Sheet>
                    </Sheet>
                </MangaContext.Provider>
            </MangaConnectorContext.Provider>
        </ApiContext.Provider>
    );
}
