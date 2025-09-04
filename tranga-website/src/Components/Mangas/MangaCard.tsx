import {
    Badge,
    Card,
    CardContent,
    CardCover,
    Skeleton,
    Typography,
} from '@mui/joy'
import { EventHandler, ReactNode, useContext } from 'react'
import './MangaCard.css'
import MangaConnectorIcon from './MangaConnectorIcon.tsx'
import { Manga, MinimalManga } from '../../api/data-contracts.ts'
import { ApiContext } from '../../contexts/ApiContext.tsx'

export default function MangaCard(props: MangaCardProps): ReactNode {
    const Api = useContext(ApiContext);

    return (
        <Badge
            badgeContent={props.manga?.mangaConnectorIds.map((id) => (
                <MangaConnectorIcon mangaConnectorName={id.mangaConnectorName} />
            ))}
            className={'manga-card-badge'}
        >
            <Card className={'manga-card'} onClick={props.onClick}>
                <CardCover className={'manga-card-cover'}>
                    <img src={props.manga && props.manga.key != "Search" ? `${Api.baseUrl}/v2/Manga/${props.manga?.key}/Cover` : '/blahaj.png'} />
                </CardCover>
                <CardCover className={'manga-card-cover-blur'} />   
                <CardContent className={'manga-card-content'}>
                    <Typography level={'h4'}>
                        {props.manga?.name ?? (   
                            <Skeleton>{stringWithRandomLength()}</Skeleton>
                        )}
                    </Typography>
                </CardContent>
            </Card>
        </Badge>
    )
}

export interface MangaCardProps {
    manga?: Manga | MinimalManga
    onClick?: EventHandler<any>
}

const stringWithRandomLength = (): string => {
    return 'wow'
}
