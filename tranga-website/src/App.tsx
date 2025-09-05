import Sheet from '@mui/joy/Sheet';
import Header from './Header.tsx';
import Settings from './Components/Settings/Settings.tsx';
import ApiProvider, { ApiContext } from './contexts/ApiContext.tsx';
import { useContext, useEffect, useState } from 'react';
import { ApiConfig } from './api/http-client.ts';
import MangaProvider from './contexts/MangaContext.tsx';
import MangaList from './Components/Mangas/MangaList.tsx';
import { Search } from './Search.tsx';
import MangaConnectorProvider from './contexts/MangaConnectorContext.tsx';
import LibraryProvider from './contexts/FileLibraryContext.tsx';
import MangaDetail from './Components/Mangas/Detail/MangaDetail.tsx';
import TButton from './Components/Inputs/TButton.tsx';

export function App() {
    const [apiUri, setApiUri] = useState<string>(
        localStorage.getItem('apiUri') ??
            window.location.href.substring(0, window.location.href.lastIndexOf('/')) + '/api'
    );
    const [apiConfig, setApiConfig] = useState<ApiConfig>({ baseUrl: apiUri });
    useEffect(() => {
        setApiConfig({ baseUrl: apiUri });
    }, [apiUri]);

    const Api = useContext(ApiContext);

    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [downloadDrawerOpen, setDownloadDrawerOpen] = useState(false);
    const [selectedMangaKey, setSelectedMangaKey] = useState<string>();
    const [downloadSectionOpen, setDownloadSectionOpen] = useState(false);

    function openMangaDownloadDrawer(mangaKey: string, downloadSectionOpen?: boolean) {
        setDownloadDrawerOpen(true);
        setSelectedMangaKey(mangaKey);
        setDownloadSectionOpen(downloadSectionOpen ?? false);
    }

    const removeManga = async (mangaKey?: string): Promise<void> => {
        if (!mangaKey) return Promise.reject();
        try {
            let r = await Api.mangaDelete(mangaKey);
            if (r.ok) return Promise.resolve();
            else return Promise.reject();
        } catch (reason) {
            return await Promise.reject(reason);
        }
    };

    return (
        <ApiProvider apiConfig={apiConfig}>
            <MangaConnectorProvider>
                <LibraryProvider>
                    <MangaProvider>
                        <Sheet className={'app'}>
                            <Header>
                                <Settings setApiUri={setApiUri} />
                            </Header>
                            <Sheet className={'app-content'}>
                                <MangaList
                                    mangaOnClick={(m) => openMangaDownloadDrawer(m.key)}
                                    openSearch={() => setSearchOpen(true)}
                                />
                                <Search
                                    open={searchOpen}
                                    setOpen={setSearchOpen}
                                    mangaOnClick={(m) => openMangaDownloadDrawer(m.key, true)}
                                />
                                <MangaDetail
                                    open={downloadDrawerOpen}
                                    setOpen={setDownloadDrawerOpen}
                                    mangaKey={selectedMangaKey}
                                    downloadOpen={downloadSectionOpen}>
                                    <TButton onClick={() => removeManga(selectedMangaKey)}>
                                        Remove
                                    </TButton>
                                </MangaDetail>
                            </Sheet>
                        </Sheet>
                    </MangaProvider>
                </LibraryProvider>
            </MangaConnectorProvider>
        </ApiProvider>
    );
}
