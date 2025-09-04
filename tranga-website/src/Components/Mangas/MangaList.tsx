import { Stack } from '@mui/joy'
import './MangaList.css'
import { Dispatch, ReactNode, useContext, useEffect, useState } from 'react'
import {
    Manga,
    MangaReleaseStatus,
    MinimalManga,
} from '../../api/data-contracts.ts'
import { ApiContext } from '../../contexts/ApiContext.tsx'
import MangaCard from './MangaCard.tsx'

export default function MangaList({
    openSearch,
}: {
    openSearch: () => void
}): ReactNode {
    const Api = useContext(ApiContext)
    const [downloadingManga, setDownloadingManga] = useState<MinimalManga[]>([])

    useEffect(() => {
        Api.mangaDownloadingList().then((data) => {
            if (data.ok) {
                setDownloadingManga(data.data)
            }
        })
    }, [Api])

    return (
        <MangaCardList manga={downloadingManga}>
            <MangaCard
                onClick={openSearch}
                manga={{
                    name: 'Search',
                    description: 'Search for a new Manga',
                    releaseStatus: MangaReleaseStatus.Continuing,
                    mangaConnectorIds: [],
                    key: 'Search',
                }}
            />
        </MangaCardList>
    )
}

export function MangaCardList(props: MangaCardListProps): ReactNode {
    return (
        <Stack
            className={'manga-list'}
            direction={'row'}
            flexWrap={'wrap'}
            sx={{
                mx: 'calc(-1 * var(--ModalDialog-padding))',
                px: 'var(--ModalDialog-padding)',
                overflowY: 'scroll',
                justifyItems: 'space-between',
            }}
        >
            {props.children}
            {props.manga.map((m) => (
                <MangaCard
                    key={m.key}
                    manga={m}
                    onClick={() => {
                        if (props.mangaOnClick) props.mangaOnClick(m)
                    }}
                />
            ))}
        </Stack>
    )
}

export interface MangaCardListProps {
    manga: (Manga | MinimalManga)[]
    children?: ReactNode
    mangaOnClick?: Dispatch<Manga | MinimalManga>
}
