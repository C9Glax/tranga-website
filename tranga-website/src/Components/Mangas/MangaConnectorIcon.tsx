import { ReactNode, useContext, useEffect, useState } from 'react';
import { MangaConnector } from '../../api/data-contracts.ts';
import { Tooltip } from '@mui/joy';
import { ApiContext } from '../../contexts/ApiContext.tsx';

export default function MangaConnectorIcon({
    mangaConnector,
    mangaConnectorName,
}: {
    mangaConnector?: MangaConnector;
    mangaConnectorName?: string;
}): ReactNode {
    const Api = useContext(ApiContext);

    const [connector, setConnector] = useState<MangaConnector | undefined>(mangaConnector);

    useEffect(() => {
        if (mangaConnector) {
            setConnector(mangaConnector);
            return;
        }
        if (!mangaConnectorName) return;
        Api.mangaConnectorDetail(mangaConnectorName).then((result) => {
            if (result.ok) {
                setConnector(result.data);
            }
        });
    }, [Api, mangaConnectorName, mangaConnector]);

    return (
        <Tooltip title={connector?.name ?? 'loading'}>
            <img
                src={connector?.iconUrl ?? '/blahaj.png'}
                width={'25px'}
                height={'25px'}
                style={{ borderRadius: '100%' }}
            />
        </Tooltip>
    );
}
