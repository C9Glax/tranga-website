import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    List,
    ListItem,
    Option,
    Select,
    Stack,
    Typography,
} from '@mui/joy';
import { ReactNode, useContext, useEffect, useState } from 'react';
import TButton from '../../Inputs/TButton.tsx';
import MangaConnectorIcon from '../MangaConnectorIcon.tsx';
import { FileLibrary, Manga, MangaConnectorId } from '../../../api/data-contracts.ts';
import { FileLibraryContext } from '../../../contexts/FileLibraryContext.tsx';
import { ApiContext } from '../../../contexts/ApiContext.tsx';

export function DownloadSection(props: DownloadSectionProps): ReactNode {
    const Api = useContext(ApiContext);
    const Libraries = useContext(FileLibraryContext);

    const [manga, setManga] = useState<Manga>();
    const [library, setLibrary] = useState<FileLibrary | undefined>();
    const [downloadFromMap, setDownloadFromMap] = useState<Map<MangaConnectorId, boolean>>(new Map());

    useEffect(() => {
        const newMap = new Map();
        setLibrary(Libraries.find((library) => library.key == manga?.fileLibraryId));
        manga?.mangaConnectorIds.forEach((id) => {
            newMap.set(id, id.useForDownload);
        });
        setDownloadFromMap(newMap);
    }, [manga, Libraries]);

    useEffect(() => {
        setManga(props.manga);
    }, [props]);

    const onLibraryChange = (_: any, value: string | null) => {
        setLibrary(Libraries.find((library) => library.key == value));
    };

    const setDownload = async (): Promise<void> => {
        if (!manga) return Promise.reject();
        if (library) {
            const s = await Api.mangaChangeLibraryCreate(manga.key, library?.key)
                .then((result) => result.ok)
                .catch(() => false);
            if (!s) return Promise.reject();
        }
        for (const kv of downloadFromMap) {
            const s = await Api.mangaSetAsDownloadFromCreate(manga?.key, kv[0].mangaConnectorName, kv[1])
                .then((result) => result.ok)
                .catch(() => false);
            if (!s) return Promise.reject();
        }
        return Promise.resolve();
    };

    return (
        <Accordion
            expanded={props.expanded}
            onChange={(_, expanded) => props.onExpanded(expanded)}>
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
                        <Typography>Select which connectors you want to download this Manga from:</Typography>
                        <List>
                            {props.manga?.mangaConnectorIds.map((id) => (
                                <ListItem key={id.key}>
                                    <Checkbox
                                        defaultChecked={id.useForDownload}
                                        onChange={(c) => downloadFromMap.set(id, c.target.checked)}
                                        label={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                <MangaConnectorIcon mangaConnectorName={id.mangaConnectorName} />
                                                <Typography>{id.mangaConnectorName}</Typography>
                                            </div>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <TButton onClick={setDownload}>Download All</TButton>
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}
export interface DownloadSectionProps {
    manga?: Manga;
    expanded: boolean;
    onExpanded: (expanded: boolean) => void;
}
