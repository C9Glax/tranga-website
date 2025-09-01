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
  MinimalManga,
} from "./apiClient/data-contracts.ts";
import Search from "./Components/Search.tsx";
import { Typography } from "@mui/joy";
import Workers from "./Components/WorkerModal/Workers.tsx";

const apiUri =
  localStorage.getItem("apiUri") ??
  window.location.href.substring(0, window.location.href.lastIndexOf("/")) +
    "/api";
localStorage.setItem("apiUri", apiUri);
const Api = new V2({ baseUrl: apiUri });

const manga: Manga[] = [];
const promises: Map<string, Promise<Manga | undefined>> = new Map();
const getManga = async (key: string): Promise<Manga | undefined> => {
  const result = manga.find((m) => m.key === key);
  if (result) return result;
  if (promises.has(key)) return promises.get(key);
  const newPromise = retrieveManga(key);
  promises.set(key, newPromise);
  return newPromise;
};

const retrieveManga = async (key: string): Promise<Manga | undefined> => {
  return Api.mangaDetail(key).then((response) => {
    if (response.ok) {
      manga.push(response.data);
      return response.data;
    }
    return undefined;
  });
};

export const MangaConnectorContext = createContext<MangaConnector[]>([]);
export const MangaContext = createContext<{
  getManga: (key: string) => Promise<Manga | undefined>;
}>({
  getManga,
});
export const FileLibraryContext = createContext<FileLibrary[]>([]);

const updateApiUri = (uri: string) => {
  localStorage.setItem("apiUri", uri);
  window.location.reload();
};

export default function App() {
  const [mangaConnectors, setMangaConnectors] = useState<MangaConnector[]>([]);
  const [downloadingManga, setDownloadingManga] = useState<MinimalManga[]>([]);
  const [fileLibraries, setFileLibraries] = useState<FileLibrary[]>([]);

  useEffect(() => {
    Api.mangaConnectorList().then((response) => {
      if (response.ok) setMangaConnectors(response.data);
    });

    Api.fileLibraryList().then((response) => {
      if (response.ok) setFileLibraries(response.data);
    });

    Api.mangaDownloadingList().then((response) => {
      if (response.ok) setDownloadingManga(response.data);
    });
  }, []);

  return (
    <ApiContext.Provider value={Api}>
      <FileLibraryContext value={fileLibraries}>
        <MangaConnectorContext.Provider value={mangaConnectors}>
          <MangaContext.Provider value={{ getManga }}>
            {Api ? (
              <Sheet className={"app"}>
                <Header>
                  <Settings setApiUri={updateApiUri} />
                  <Workers />
                </Header>
                <Sheet className={"app-content"}>
                  <MangaList manga={downloadingManga}>
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
