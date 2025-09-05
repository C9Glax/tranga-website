import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { MangaConnector } from '../api/data-contracts.ts';
import { ApiContext } from './ApiContext.tsx';

export const MangaConnectorContext = createContext<MangaConnector[]>([]);

export default function MangaConnectorProvider({ children }: { children: ReactNode }) {
    const Api = useContext(ApiContext);

    const [state, setState] = useState<MangaConnector[]>([]);

    useEffect(() => {
        Api.mangaConnectorList().then((result) => {
            if (result.ok) {
                setState(result.data);
            }
        });
    }, [Api]);

    return <MangaConnectorContext value={state}>{children}</MangaConnectorContext>;
}
