import {
    Badge,
    Card,
    CardContent,
    CardCover,
    Skeleton,
    Typography,
} from '@mui/joy'
import { EventHandler, ReactNode, useContext, useEffect, useState } from 'react'
import './MangaCard.css'
import MangaConnectorIcon from './MangaConnectorIcon.tsx'
import { Manga, MinimalManga } from '../../api/data-contracts.ts'
import { ApiContext } from '../../contexts/ApiContext.tsx'

export default function MangaCard({
    mangaDetail,
    key,
    onClick,
}: {
    mangaDetail?: Manga | MinimalManga
    key?: string
    onClick?: EventHandler<any>
}): ReactNode {
    const Api = useContext(ApiContext)

    const [manga, setManga] = useState<Manga | MinimalManga | undefined>(
        mangaDetail
    )

    useEffect(() => {
        if (!key) return
        Api.mangaDetail(key).then((data) => {
            if (data.ok) {
                setManga(data.data)
            }
        })
    }, [Api, key])

    return (
        <Badge
            badgeContent={manga?.mangaConnectorIds.map((id) => (
                <MangaConnectorIcon key={id.mangaConnectorName} />
            ))}
            className={'manga-card-badge'}
        >
            <Card className={'manga-card'} onClick={onClick}>
                <CardCover className={'manga-card-cover'}>
                    <img src={'/blahaj.png'} />
                </CardCover>
                <CardCover className={'manga-card-cover-blur'} />
                <CardContent className={'manga-card-content'}>
                    <Typography level={'h4'}>
                        {manga?.name ?? (
                            <Skeleton>{stringWithRandomLength()}</Skeleton>
                        )}
                    </Typography>
                </CardContent>
            </Card>
        </Badge>
    )
}

const stringWithRandomLength = (): string => {
    return 'wow'
}
