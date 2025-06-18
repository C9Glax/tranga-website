import {createContext} from "react";
import IManga, {DefaultManga} from "../types/IManga.ts";

export const MangaContext = createContext<{mangas: IManga[], GetManga: (mangaId: string) => Promise<IManga | undefined>}>(
    {
        mangas : [],
        GetManga: _ => Promise.resolve(DefaultManga)
    }
);