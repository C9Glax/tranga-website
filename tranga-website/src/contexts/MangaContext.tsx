import { createContext, ReactNode, useContext } from 'react'
import { ApiContext } from './ApiContext.tsx'
import { Manga } from '../api/data-contracts.ts'
import { V2 } from '../api/V2.ts'

export const MangaContext = createContext<M>({
    GetManga: () => Promise.reject(),
})
const manga: Map<string, Manga> = new Map()
const promises: Map<string, Promise<Manga | undefined>> = new Map()

export default function MangaProvider({ children }: { children: ReactNode }) {
    const Api = useContext(ApiContext)

    return (
        <MangaContext value={{ GetManga: (k) => getManga(k, Api) }}>
            {children}
        </MangaContext>
    )
}

function getManga(key: string, Api: V2): Promise<Manga | undefined> {
    if (manga.has(key)) return Promise.resolve(manga.get(key))

    if (promises.has(key)) return promises.get(key)!

    const newPromise = Api.mangaDetail(key)
        .then((data) => {
            if (data.ok) {
                manga.set(key, data.data)
                return data.data
            } else return undefined
        })
        .catch(() => {
            return undefined
        })
    promises.set(key, newPromise)
    return newPromise
}

export interface M {
    GetManga(key: string): Promise<Manga | undefined>
}
