import Sheet from '@mui/joy/Sheet';
import Header from './Header.tsx';
import Settings from './Components/Settings/Settings.tsx';
import ApiProvider from './contexts/ApiContext.tsx';
import { useEffect, useState } from 'react';
import { ApiConfig } from './api/http-client.ts';
import MangaProvider from './contexts/MangaContext.tsx';
import MangaList from './Components/Mangas/MangaList.tsx';
import { Search } from './Search.tsx';
import MangaConnectorProvider from './contexts/MangaConnectorContext.tsx';
import LibraryProvider from './contexts/FileLibraryContext.tsx';

export default function App() {
    const [apiUri, setApiUri] = useState<string>(
        localStorage.getItem('apiUri') ??
            window.location.href.substring(
                0,
                window.location.href.lastIndexOf('/')
            ) + '/api'
    );
    const [apiConfig, setApiConfig] = useState<ApiConfig>({ baseUrl: apiUri });
    useEffect(() => {
        setApiConfig({ baseUrl: apiUri });
    }, [apiUri]);

    const [searchOpen, setSearchOpen] = useState<boolean>(false);

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
                                    openSearch={() => setSearchOpen(true)}
                                />
                                <Search
                                    open={searchOpen}
                                    setOpen={setSearchOpen}
                                />
                            </Sheet>
                        </Sheet>
                    </MangaProvider>
                </LibraryProvider>
            </MangaConnectorProvider>
        </ApiProvider>
    );
}
