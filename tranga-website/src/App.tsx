import Sheet from "@mui/joy/Sheet";
import "./App.css";
import Settings from "./Components/Settings/Settings.tsx";
import Header from "./Header.tsx";
import { createContext, ReactNode, useEffect, useState } from "react";
import { V2 } from "./apiClient/V2.ts";
import { ApiContext } from "./apiClient/ApiContext.tsx";
import MangaList from "./Components/Mangas/MangaList.tsx";
import {
  FileLibrary,
  Manga,
  MangaConnector,
} from "./apiClient/data-contracts.ts";
import Search from "./Components/Search.tsx";
import { Typography } from "@mui/joy";
import Workers from "./Components/WorkerModal/Workers.tsx";

export const MangaConnectorContext = createContext<MangaConnector[]>([]);
export const MangaContext = createContext<Manga[]>([]);
export const FileLibraryContext = createContext<FileLibrary[]>([]);

export default function App() {
  const apiUriStr =
    localStorage.getItem("apiUri") ??
    window.location.href.substring(0, window.location.href.lastIndexOf("/")) +
      "/api";
  const [apiUri, setApiUri] = useState<string>(apiUriStr);
  const [Api, setApi] = useState<V2>(
    new V2({
      baseUrl: apiUri,
    }),
  );

  const [mangaConnectors, setMangaConnectors] = useState<MangaConnector[]>([]);
  const [manga, setManga] = useState<Manga[]>([]);
  const [fileLibraries, setFileLibraries] = useState<FileLibrary[]>([]);

  useEffect(() => {
    Api.mangaConnectorList().then((response) => {
      if (response.ok) setMangaConnectors(response.data);
    });

    Api.fileLibraryList().then((response) => {
      if (response.ok) setFileLibraries(response.data);
    });

    Api.mangaDownloadingList().then((response) => {
      if (response.ok) setManga(response.data);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("apiUri", apiUri);
    if (Api.baseUrl != apiUri)
      setApi(
        new V2({
          baseUrl: apiUri,
        }),
      );
  }, [apiUri]);

  return (
    <ApiContext.Provider value={Api}>
      <FileLibraryContext value={fileLibraries}>
        <MangaConnectorContext.Provider value={mangaConnectors}>
          <MangaContext.Provider value={manga}>
            {Api ? (
              <Sheet className={"app"}>
                <Header>
                  <Settings setApiUri={setApiUri} />
                  <Workers />
                </Header>
                <Sheet className={"app-content"}>
                  <MangaList mangas={manga}>
                    <Search />
                  </MangaList>
                </Sheet>
              </Sheet>
            ) : (
              <Loading />
            )}
          </MangaContext.Provider>
        </MangaConnectorContext.Provider>
      </FileLibraryContext>
    </ApiContext.Provider>
  );
}

function Loading(): ReactNode {
  return <Typography>Loading</Typography>;
}
