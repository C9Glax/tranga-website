import { Dispatch, ReactNode, useContext, useEffect, useState } from 'react';
import { AccordionGroup, Card, CardCover, Chip, Modal, ModalDialog, Stack, Typography, useTheme } from '@mui/joy';
import ModalClose from '@mui/joy/ModalClose';
import { Manga } from '../../../api/data-contracts.ts';
import { ApiContext } from '../../../contexts/ApiContext.tsx';
import { MangaContext } from '../../../contexts/MangaContext.tsx';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { DownloadSection } from './DownloadSection.tsx';
import ChaptersSection from './ChaptersSection.tsx';
import { LibrarySection } from './LibrarySection.tsx';

export default function MangaDetail(props: MangaDetailProps): ReactNode {
    const Api = useContext(ApiContext);
    const Manga = useContext(MangaContext);
    const theme = useTheme();

    const [manga, setManga] = useState<Manga | undefined>(props.manga);

    useEffect(() => {
        if (!props.open) return;
        if (!props.mangaKey) return;
        if (props.manga != undefined) return;
        Manga.GetManga(props.mangaKey).then(setManga);
    }, [Api, Manga, props]);

    const [expanded, setExpanded] = useState(props.downloadOpen ? 1 : 0);

    return (
        <Modal
            open={props.open}
            onClose={() => props.setOpen(false)}>
            <ModalDialog>
                <ModalClose />
                <Typography
                    level={'h3'}
                    sx={{ width: '100%' }}>
                    {manga?.name}
                </Typography>
                <Stack
                    direction={'row'}
                    gap={1}>
                    <Card
                        className={'manga-card'}
                        sx={{ flexShrink: 0 }}>
                        <CardCover className={'manga-card-cover'}>
                            <img src={manga ? `${Api.baseUrl}/v2/Manga/${manga.key}/Cover/Medium` : '/blahaj.png'} />
                        </CardCover>
                    </Card>
                    <Stack
                        direction={'column'}
                        gap={2}
                        sx={{ flexShrink: 1 }}>
                        <Stack
                            direction={'row'}
                            gap={0.5}
                            flexWrap={'wrap'}>
                            {manga?.tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    size={'sm'}
                                    sx={{ backgroundColor: theme.palette.primary.plainColor }}>
                                    {tag}
                                </Chip>
                            ))}
                            {manga?.authors.map((author) => (
                                <Chip
                                    key={author.key}
                                    size={'sm'}
                                    sx={{ backgroundColor: theme.palette.success.plainColor }}>
                                    {author.name}
                                </Chip>
                            ))}
                            {manga?.links.map((link) => (
                                <Chip
                                    key={link.provider}
                                    size={'sm'}
                                    sx={{ backgroundColor: theme.palette.neutral.plainColor }}>
                                    <a href={link.url}>{link.provider}</a>
                                </Chip>
                            ))}
                        </Stack>
                        <MarkdownPreview
                            source={manga?.description}
                            style={{
                                backgroundColor: 'transparent',
                                color: theme.palette.text.primary,
                                overflowY: 'auto',
                            }}
                        />
                        <Stack
                            direction={'row-reverse'}
                            gap={1}>
                            {props.children}
                        </Stack>
                    </Stack>
                </Stack>
                <AccordionGroup>
                    <DownloadSection
                        expanded={expanded == 1}
                        onExpanded={(e) => {
                            if (e) setExpanded(1);
                            else setExpanded(0);
                        }}
                        manga={manga}
                    />
                    <LibrarySection
                        expanded={expanded == 2}
                        onExpanded={(e) => {
                            if (e) setExpanded(2);
                            else setExpanded(0);
                        }}
                        manga={manga}
                    />
                    <ChaptersSection
                        expanded={expanded == 3}
                        onExpanded={(e) => {
                            if (e) setExpanded(3);
                            else setExpanded(0);
                        }}
                        manga={manga}
                    />
                </AccordionGroup>
            </ModalDialog>
        </Modal>
    );
}

export interface MangaDetailProps {
    manga?: Manga;
    mangaKey?: string;
    open: boolean;
    setOpen: Dispatch<boolean>;
    downloadOpen?: boolean;
    children?: ReactNode;
}
