import {createContext} from "react";
import IChapter from "../types/IChapter.ts";

export const ChapterContext = createContext<{chapters: IChapter[], GetChapter: (chapterId: string) => Promise<IChapter | undefined>}>(
    {
        chapters : [],
        GetChapter: _ => Promise.resolve(undefined)
    }
);