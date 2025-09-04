import {
    Badge,
    Card,
    CardContent,
    CardCover,
    ColorPaletteProp,
    Skeleton,
    Typography,
} from '@mui/joy'
import { EventHandler, ReactNode, useContext } from 'react'
import './MangaCard.css'
import MangaConnectorIcon from './MangaConnectorIcon.tsx'
import {
    Manga,
    MangaReleaseStatus,
    MinimalManga,
} from '../../api/data-contracts.ts'
import { ApiContext } from '../../contexts/ApiContext.tsx'

export default function MangaCard(props: MangaCardProps): ReactNode {
    const Api = useContext(ApiContext)

    return (
        <Badge
            badgeContent={props.manga?.mangaConnectorIds.map((id) => (
                <MangaConnectorIcon
                    mangaConnectorName={id.mangaConnectorName}
                />
            ))}
            className={'manga-card-badge'}
            color={releaseColor(
                props.manga?.releaseStatus ?? MangaReleaseStatus.Unreleased
            )}
        >
            <Card className={'manga-card'} onClick={props.onClick}>
                <CardCover className={'manga-card-cover'}>
                    <img
                        src={
                            props.manga && props.manga.key != 'Search'
                                ? `${Api.baseUrl}/v2/Manga/${props.manga?.key}/Cover`
                                : '/blahaj.png'
                        }
                    />
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

const releaseColor = (status: MangaReleaseStatus): ColorPaletteProp => {
    switch (status) {
        case MangaReleaseStatus.Cancelled:
            return 'danger'
        case MangaReleaseStatus.Completed:
            return 'success'
        case MangaReleaseStatus.Unreleased:
            return 'neutral'
        case MangaReleaseStatus.Continuing:
            return 'primary'
        case MangaReleaseStatus.OnHiatus:
            return 'neutral'
        default:
            return 'neutral'
    }
}
