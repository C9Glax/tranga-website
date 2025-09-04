import { Dispatch, ReactNode, useContext, useEffect, useState } from 'react';
import {
    Box,
    Card,
    Checkbox,
    Drawer,
    List,
    ListItem,
    Option,
    Select,
    Stack,
    Typography,
} from '@mui/joy';
import ModalClose from '@mui/joy/ModalClose';
import { FileLibrary, Manga, MangaConnectorId } from './api/data-contracts.ts';
import { ApiContext } from './contexts/ApiContext.tsx';
import { MangaContext } from './contexts/MangaContext.tsx';
import { FileLibraryContext } from './contexts/FileLibraryContext.tsx';
import MangaConnectorIcon from './Components/Mangas/MangaConnectorIcon.tsx';
import TButton from './Components/Inputs/TButton.tsx';

export default function MangaDownloadDrawer(
    props: MangaDownloadDrawerProps
): ReactNode {
    const Api = useContext(ApiContext);
    const Manga = useContext(MangaContext);
    const Libraries = useContext(FileLibraryContext);

    const [manga, setManga] = useState<Manga | undefined>(props.manga);
    const [library, setLibrary] = useState<FileLibrary | undefined>();
    const [downloadFromMap, setDownloadFromMap] = useState<
        Map<MangaConnectorId, boolean>
    >(new Map());

    useEffect(() => {
        if (!props.open) return;
        if (!props.mangaKey) return;
        if (props.manga != undefined) return;
        Manga.GetManga(props.mangaKey).then(setManga);
    }, [Api, Manga, props]);

    useEffect(() => {
        const newMap = new Map();
        setLibrary(
            Libraries.find((library) => library.key == manga?.fileLibraryId)
        );
        manga?.mangaConnectorIds.forEach((id) => {
            newMap.set(id, id.useForDownload);
        });
        setDownloadFromMap(newMap);
    }, [manga]);

    const setDownload = async (): Promise<void> => {
        if (!manga) return Promise.reject();
        if (library) {
            const s = await Api.mangaChangeLibraryCreate(
                manga.key,
                library?.key
            )
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
        <Drawer
            open={props.open}
            onClose={() => props.setOpen(false)}
            anchor="left"
            size="md">
            <Card sx={{ flexGrow: 1, margin: '10px' }}>
                <ModalClose />
                <Typography level={'h3'}>Download</Typography>
                <Typography level={'h4'}>{manga?.name}</Typography>
                <Stack
                    direction={'column'}
                    gap={2}
                    sx={{ flexBasis: 0 }}>
                    <Box>
                        <Typography>
                            Select a Library to Download to:
                        </Typography>
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
                            Select which connectors you want to download this
                            Manga from:
                        </Typography>
                        <List>
                            {manga?.mangaConnectorIds.map((id) => (
                                <ListItem key={id.key}>
                                    <Checkbox
                                        defaultChecked={id.useForDownload}
                                        onChange={(c) =>
                                            downloadFromMap.set(
                                                id,
                                                c.target.checked
                                            )
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
                    <TButton completionAction={setDownload}>
                        Download All
                    </TButton>
                </Stack>
            </Card>
        </Drawer>
    );
}

export interface MangaDownloadDrawerProps {
    manga?: Manga;
    mangaKey?: string;
    open: boolean;
    setOpen: Dispatch<boolean>;
}
