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
import JobsDrawer from "./Components/Jobs.tsx";
import {MangaContext} from "./api/Contexts/MangaContext.tsx";
import IManga from "./api/types/IManga.ts";
import {GetMangaById} from "./api/Manga.tsx";
import IChapter from "./api/types/IChapter.ts";
import {GetChapterFromId} from "./api/Chapter.tsx";
import {ChapterContext} from "./api/Contexts/ChapterContext.tsx";

export default function App () {

    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [showJobs, setShowJobs] = useState<boolean>(false);
    const [apiConnected, setApiConnected] = useState<boolean>(false);

    const apiUriStr = localStorage.getItem("apiUri") ?? window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/api";

    const [apiUri, setApiUri] = useState<string>(apiUriStr);
    const [mangas, setMangas] = useState<IManga[]>([]);
    const [chapters, setChapters] = useState<IChapter[]>([]);

    useEffect(() => {
        localStorage.setItem("apiUri", apiUri);
    }, [apiUri]);

    const [mangaPromises, setMangaPromises] = useState(new Map<string, Promise<IManga | undefined>>());
    const GetManga = (mangaId: string) : Promise<IManga | undefined> => {
        const promise = mangaPromises.get(mangaId);
        if(promise) return promise;
        const p = new Promise<IManga | undefined>((resolve, reject) => {
            let ret = mangas?.find(m => m.mangaId == mangaId);
            if (ret) resolve(ret);

            console.log(`Fetching manga ${mangaId}`);
            GetMangaById(apiUri, mangaId).then(manga => {
                if(manga && mangas?.find(m => m.mangaId == mangaId) === undefined)
                    setMangas([...mangas, manga]);
                resolve(manga);
            }).catch(reject);
        });
        setMangaPromises(mangaPromises.set(mangaId, p));
        return p;
    }

    const [chapterPromises, setChapterPromises] = useState(new Map<string, Promise<IChapter | undefined>>());
    const GetChapter = (chapterId: string) : Promise<IChapter | undefined> => {
        const promise = chapterPromises.get(chapterId);
        if(promise) return promise;
        const p = new Promise<IChapter | undefined>((resolve, reject) => {
            let ret = chapters?.find(c => c.chapterId == chapterId);
            if (ret) resolve(ret);

            console.log(`Fetching chapter ${chapterId}`);
            GetChapterFromId(apiUri, chapterId).then(chapter => {
                if(chapter && chapters?.find(c => c.chapterId == chapterId) === undefined)
                    setChapters([...chapters, chapter]);
                resolve(chapter);
            }).catch(reject);
        });
        setChapterPromises(chapterPromises.set(chapterId, p));
        return p;
    }

    const [mangaConnectors, setMangaConnectors] = useState<IMangaConnector[]>([]);

    useEffect(() => {
        if(!apiConnected) return;
        GetAllConnectors(apiUri).then(setMangaConnectors);
    }, [apiConnected]);

    return (
        <ApiUriContext.Provider value={apiUri}>
            <MangaConnectorContext.Provider value={mangaConnectors}>
                <MangaContext.Provider value={{mangas, GetManga}}>
                    <ChapterContext.Provider value={{chapters, GetChapter}}>
                        <Sheet className={"app"}>
                            <Header>
                                <Badge color={"danger"} invisible={apiConnected} badgeContent={"!"}>
                                    <Button onClick={() => setShowSettings(true)}>Settings</Button>
                                </Badge>
                                <Button onClick={() => setShowJobs(true)}>Jobs</Button>
                            </Header>
                            <Settings open={showSettings} setOpen={setShowSettings} setApiUri={setApiUri} setConnected={setApiConnected} />
                            <Search open={showSearch} setOpen={setShowSearch} />
                            <JobsDrawer open={showJobs} connected={apiConnected} setOpen={setShowJobs} />
                            <Sheet className={"app-content"}>
                                <MangaList connected={apiConnected} setShowSearch={setShowSearch} />
                            </Sheet>
                        </Sheet>
                    </ChapterContext.Provider>
                </MangaContext.Provider>
            </MangaConnectorContext.Provider>
        </ApiUriContext.Provider>
    );
}
