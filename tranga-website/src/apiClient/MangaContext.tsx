import {createContext, useContext} from "react";
import {Manga} from "./data-contracts.ts";
import {ApiContext} from "./ApiContext.tsx";

const mangaPromises = new Map<string, Promise<Manga | undefined>>();
const mangas : Manga[] = [];

export const GetManga : (id: string) => Promise<Manga | undefined> = (id: string) => {
    const API = useContext(ApiContext);
    
    const promise = mangaPromises.get(id);
    if(promise) return promise;
    const p = new Promise<Manga | undefined>((resolve, reject) => {
        let ret = mangas?.find(m => m.key == id);
        if (ret) resolve(ret);

        console.log(`Fetching manga ${id}`);
        API.mangaDetail(id)
            .then(result => {
                if (!result.ok)
                    throw new Error(`Error fetching manga detail ${id}`);
                mangas.push(result.data);
                resolve(result.data);
            }).catch(reject);
    });
    mangaPromises.set(id, p);
    return p;
};

export const MangaContext = createContext<{ GetManga: (id: string) => Promise<Manga | undefined> }>(
    {
        GetManga: GetManga
    }
);
