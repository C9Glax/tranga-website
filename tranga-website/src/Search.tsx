import { Dispatch, ReactNode, useContext, useState } from 'react'
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
} from '@mui/joy'
import ModalClose from '@mui/joy/ModalClose'
import { MangaConnectorContext } from './contexts/MangaConnectorContext.tsx'
import MangaConnectorIcon from './Components/Mangas/MangaConnectorIcon.tsx'
import TInput from './Components/Inputs/TInput.tsx'
import { ApiContext } from './contexts/ApiContext.tsx'
import { MangaCardList } from './Components/Mangas/MangaList.tsx'
import { MangaConnector, MinimalManga } from './api/data-contracts.ts'

export default function Search({
    open,
    setOpen,
}: {
    open: boolean
    setOpen: Dispatch<boolean>
}): ReactNode {
    const Api = useContext(ApiContext)
    const MangaConnectors = useContext(MangaConnectorContext)

    const [selectedConnector, setSelectedConnector] = useState<MangaConnector>()

    const [searchResults, setSearchResults] = useState<MinimalManga[]>([])

    const startSearch = (
        value: string | number | readonly string[] | undefined
    ): Promise<void> => {
        if (typeof value != 'string') return Promise.reject()
        setSearchResults([])
        if (isUrl(value)) {
            return Api.searchUrlCreate(value)
                .then((result) => {
                    if (result.ok) {
                        setSearchResults([result.data])
                        return Promise.resolve()
                    } else return Promise.reject()
                })
                .catch(Promise.reject)
        } else {
            if (!selectedConnector) return Promise.reject()
            return Api.searchDetail(selectedConnector?.key, value)
                .then((result) => {
                    if (result.ok) {
                        setSearchResults(result.data)
                        return Promise.resolve()
                    } else return Promise.reject()
                })
                .catch(Promise.reject)
        }
    }

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog sx={{ width: '90vw' }}>
                <ModalClose />
                <Stepper>
                    <Step
                        orientation={'vertical'}
                        indicator={<StepIndicator>1</StepIndicator>}
                    >
                        <Typography level={'title-lg'}>
                            Select a connector
                        </Typography>
                        <List>
                            {MangaConnectors.map((c) => (
                                <ListItem
                                    onClick={() => setSelectedConnector(c)}
                                >
                                    <ListItemDecorator>
                                        <MangaConnectorIcon
                                            mangaConnector={c}
                                        />
                                    </ListItemDecorator>
                                    <Typography
                                        sx={
                                            c.key == selectedConnector?.key
                                                ? { fontWeight: 'bold' }
                                                : {}
                                        }
                                    >
                                        {c.name}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Step>
                    <Step
                        orientation={'vertical'}
                        indicator={<StepIndicator>2</StepIndicator>}
                    >
                        <Typography level={'title-lg'}>
                            Enter a search term or URL
                        </Typography>
                        <TInput
                            placeholder={'Manga-name or URL'}
                            completionAction={startSearch}
                        />
                    </Step>
                </Stepper>
                <MangaCardList manga={searchResults} />
            </ModalDialog>
        </Modal>
    )
}

function isUrl(str: string): boolean {
    try {
        new URL(str)
        return true
    } catch {
        return false
    }
}
