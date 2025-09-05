import { Dispatch, ReactNode, useContext, useEffect, useState } from 'react';
import {
    List,
    ListItem,
    ListItemDecorator,
    Modal,
    ModalDialog,
    Step,
    StepIndicator,
    Stepper,
    Typography,
} from '@mui/joy';
import ModalClose from '@mui/joy/ModalClose';
import { MangaConnectorContext } from './contexts/MangaConnectorContext.tsx';
import MangaConnectorIcon from './Components/Mangas/MangaConnectorIcon.tsx';
import TInput from './Components/Inputs/TInput.tsx';
import { ApiContext } from './contexts/ApiContext.tsx';
import { MangaCardList } from './Components/Mangas/MangaList.tsx';
import { MangaConnector, MinimalManga } from './api/data-contracts.ts';

export function Search(props: SearchModalProps): ReactNode {
    const Api = useContext(ApiContext);
    const MangaConnectors = useContext(MangaConnectorContext);

    useEffect(() => {
        if (props.open) {
            setSelectedConnector(undefined);
            setSearchResults([]);
        }
    }, [props]);

    const [selectedConnector, setSelectedConnector] = useState<MangaConnector>();
    const [searchResults, setSearchResults] = useState<MinimalManga[]>([]);

    const startSearch = async (
        value: string | number | readonly string[] | undefined
    ): Promise<void> => {
        if (typeof value != 'string') return Promise.reject();
        setSearchResults([]);
        if (isUrl(value)) {
            try {
                const result = await Api.searchUrlCreate(value);
                if (result.ok) {
                    setSearchResults([result.data]);
                    return Promise.resolve();
                } else return Promise.reject();
            } catch (reason) {
                return await Promise.reject(reason);
            }
        } else {
            if (!selectedConnector) return Promise.reject();
            try {
                const result2 = await Api.searchDetail(selectedConnector?.key, value);
                if (result2.ok) {
                    setSearchResults(result2.data);
                    return Promise.resolve();
                } else return Promise.reject();
            } catch (reason1) {
                return await Promise.reject(reason1);
            }
        }
    };

    return (
        <Modal
            open={props.open}
            onClose={() => props.setOpen(false)}>
            <ModalDialog sx={{ width: '90vw' }}>
                <ModalClose />
                <Stepper>
                    <Step
                        orientation={'vertical'}
                        indicator={<StepIndicator>1</StepIndicator>}>
                        <Typography level={'title-lg'}>Select a connector</Typography>
                        <List>
                            {MangaConnectors.map((c) => (
                                <ListItem
                                    key={c.key}
                                    onClick={() => setSelectedConnector(c)}>
                                    <ListItemDecorator>
                                        <MangaConnectorIcon mangaConnector={c} />
                                    </ListItemDecorator>
                                    <Typography
                                        sx={
                                            c.key == selectedConnector?.key
                                                ? { fontWeight: 'bold' }
                                                : {}
                                        }>
                                        {c.name}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Step>
                    <Step
                        orientation={'vertical'}
                        indicator={<StepIndicator>2</StepIndicator>}>
                        <Typography level={'title-lg'}>Enter a search term or URL</Typography>
                        <TInput
                            placeholder={'Manga-name or URL'}
                            completionAction={startSearch}
                        />
                    </Step>
                </Stepper>
                <MangaCardList
                    manga={searchResults}
                    mangaOnClick={props.mangaOnClick}
                />
            </ModalDialog>
        </Modal>
    );
}

export interface SearchModalProps {
    open: boolean;
    setOpen: Dispatch<boolean>;
    mangaOnClick?: (manga: MinimalManga) => void;
}

function isUrl(str: string): boolean {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}
