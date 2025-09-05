import { ReactNode, useContext, useEffect, useState } from 'react';
import { FileLibrary, Manga } from '../../../api/data-contracts.ts';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Option,
    Select,
    Stack,
    Typography,
} from '@mui/joy';
import { ApiContext } from '../../../contexts/ApiContext.tsx';
import { FileLibraryContext } from '../../../contexts/FileLibraryContext.tsx';
import TButton from '../../Inputs/TButton.tsx';

export function LibrarySection(props: LibrarySectionProps): ReactNode {
    const Api = useContext(ApiContext);
    const Libraries = useContext(FileLibraryContext);

    const [library, setLibrary] = useState<FileLibrary | undefined>();

    useEffect(() => {
        if (!props.manga) return;
        setLibrary(Libraries.find((library) => library.key == props.manga?.fileLibraryId));
    }, [props]);

    const onLibraryChange = (_: any, value: string | null) => {
        setLibrary(Libraries.find((library) => library.key == value));
    };

    const submit = async (): Promise<void> => {
        if (!props.manga || !library) return Promise.reject();
        try {
            let result = await Api.mangaChangeLibraryCreate(props.manga?.key, library?.key);
            if (!result.ok) return Promise.reject();
            else return Promise.resolve();
        } catch (reason) {
            return await Promise.reject(reason);
        }
    };

    return (
        <Accordion sx={{ maxHeight: '50vh' }}>
            <AccordionSummary>
                <Typography level={'h3'}>Library</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack
                    direction={'row'}
                    gap={2}>
                    <Select
                        placeholder={'Select a Library'}
                        value={library?.key}
                        onChange={onLibraryChange}
                        sx={{ flexGrow: 1 }}>
                        {Libraries.map((l) => (
                            <Option
                                key={l.key}
                                value={l.key}>
                                {l.libraryName} ({l.basePath})
                            </Option>
                        ))}
                    </Select>
                    <TButton onClick={submit}>Move Manga to Library</TButton>
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}

export interface LibrarySectionProps {
    manga?: Manga;
}
