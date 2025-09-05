import { Dispatch, ReactNode, useContext, useEffect, useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    CardCover,
    Checkbox,
    Chip,
    List,
    ListItem,
    Modal,
    ModalDialog,
    Option,
    Select,
    Stack,
    Typography,
    useTheme,
} from '@mui/joy';
import ModalClose from '@mui/joy/ModalClose';
import { FileLibrary, Manga, MangaConnectorId } from './api/data-contracts.ts';
import { ApiContext } from './contexts/ApiContext.tsx';
import { MangaContext } from './contexts/MangaContext.tsx';
import { FileLibraryContext } from './contexts/FileLibraryContext.tsx';
import MangaConnectorIcon from './Components/Mangas/MangaConnectorIcon.tsx';
import TButton from './Components/Inputs/TButton.tsx';
import MarkdownPreview from '@uiw/react-markdown-preview';

export default function MangaDetail(props: MangaDetailProps): ReactNode {
    const Api = useContext(ApiContext);
    const Manga = useContext(MangaContext);
    const Libraries = useContext(FileLibraryContext);
    const theme = useTheme();

    const [manga, setManga] = useState<Manga | undefined>(props.manga);
    const [library, setLibrary] = useState<FileLibrary | undefined>();
    const [downloadFromMap, setDownloadFromMap] = useState<Map<MangaConnectorId, boolean>>(
        new Map()
    );

    useEffect(() => {
        if (!props.open) return;
        if (!props.mangaKey) return;
        if (props.manga != undefined) return;
        setLibrary(undefined);
        Manga.GetManga(props.mangaKey).then(setManga);
    }, [Api, Manga, props]);

    useEffect(() => {
        const newMap = new Map();
        setLibrary(Libraries.find((library) => library.key == manga?.fileLibraryId));
        manga?.mangaConnectorIds.forEach((id) => {
            newMap.set(id, id.useForDownload);
        });
        setDownloadFromMap(newMap);
    }, [manga, Libraries]);

    const setDownload = async (): Promise<void> => {
        if (!manga) return Promise.reject();
        if (library) {
            const s = await Api.mangaChangeLibraryCreate(manga.key, library?.key)
                .then((result) => result.ok)
                .catch(() => false);
            if (!s) return Promise.reject();
        }
        for (const kv of downloadFromMap) {
            const s = await Api.mangaSetAsDownloadFromCreate(
                manga?.key,
                kv[0].mangaConnectorName,
                kv[1]
            )
                .then((result) => result.ok)
                .catch(() => false);
            if (!s) return Promise.reject();
        }
        return Promise.resolve();
    };

    const onLibraryChange = (_: any, value: string | null) => {
        setLibrary(Libraries.find((library) => library.key == value));
    };

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
                            <img
                                src={
                                    manga
                                        ? `${Api.baseUrl}/v2/Manga/${manga.key}/Cover`
                                        : '/blahaj.png'
                                }
                            />
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
                    </Stack>
                </Stack>

                <Accordion defaultExpanded={props.downloadOpen}>
                    <AccordionSummary>
                        <Typography level={'h3'}>Download</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack
                            direction={'column'}
                            gap={2}
                            sx={{ flexBasis: 0 }}>
                            <Box>
                                <Typography>Select a Library to Download to:</Typography>
                                <Select
                                    placeholder={'Select a Library'}
                                    value={library?.key}
                                    onChange={onLibraryChange}>
                                    {Libraries.map((l) => (
                                        <Option
                                            key={l.key}
                                            value={l.key}>
                                            {l.libraryName} ({l.basePath})
                                        </Option>
                                    ))}
                                </Select>
                            </Box>
                            <Box>
                                <Typography>
                                    Select which connectors you want to download this Manga from:
                                </Typography>
                                <List>
                                    {manga?.mangaConnectorIds.map((id) => (
                                        <ListItem key={id.key}>
                                            <Checkbox
                                                defaultChecked={id.useForDownload}
                                                onChange={(c) =>
                                                    downloadFromMap.set(id, c.target.checked)
                                                }
                                                label={
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 5,
                                                        }}>
                                                        <MangaConnectorIcon
                                                            mangaConnectorName={
                                                                id.mangaConnectorName
                                                            }
                                                        />
                                                        <Typography>
                                                            {id.mangaConnectorName}
                                                        </Typography>
                                                    </div>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                            <TButton completionAction={setDownload}>Download All</TButton>
                        </Stack>
                    </AccordionDetails>
                </Accordion>
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
}
