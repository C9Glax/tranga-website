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
import { ReactNode, useContext } from 'react';
import TButton from '../../Inputs/TButton.tsx';
import MangaConnectorIcon from '../MangaConnectorIcon.tsx';
import { FileLibrary, Manga, MangaConnectorId } from '../../../api/data-contracts.ts';
import { FileLibraryContext } from '../../../contexts/FileLibraryContext.tsx';

export default function DownloadSection(props: DownloadSectionProps): ReactNode {
    const Libraries = useContext(FileLibraryContext);

    return (
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
                            value={props.library?.key}
                            onChange={props.onLibraryChange}>
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
                            {props.manga?.mangaConnectorIds.map((id) => (
                                <ListItem key={id.key}>
                                    <Checkbox
                                        defaultChecked={id.useForDownload}
                                        onChange={(c) =>
                                            props.downloadFromMap.set(id, c.target.checked)
                                        }
                                        label={
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 5,
                                                }}>
                                                <MangaConnectorIcon
                                                    mangaConnectorName={id.mangaConnectorName}
                                                />
                                                <Typography>{id.mangaConnectorName}</Typography>
                                            </div>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <TButton completionAction={props.setDownload}>Download All</TButton>
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}
export interface DownloadSectionProps {
    manga?: Manga;
    downloadOpen: boolean;
    library?: FileLibrary;
    onLibraryChange: (_: any, value: string | null) => void;
    downloadFromMap: Map<MangaConnectorId, boolean>;
    setDownload: () => Promise<void>;
}
