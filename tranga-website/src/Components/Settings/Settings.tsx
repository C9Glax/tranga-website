import ModalClose from '@mui/joy/ModalClose'
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary,
    Button,
    DialogContent,
    DialogTitle,
    Modal,
    ModalDialog,
} from '@mui/joy'
import './Settings.css'
import * as React from 'react'
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import { SxProps } from '@mui/joy/styles/types'
import ImageCompression from './ImageCompression.tsx'
import FlareSolverr from './FlareSolverr.tsx'
import DownloadLanguage from './DownloadLanguage.tsx'
import ChapterNamingScheme from './ChapterNamingScheme.tsx'
import Maintenance from './Maintenance.tsx'
import { ApiContext } from '../../contexts/ApiContext.tsx'
import { TrangaSettings } from '../../api/data-contracts.ts'
import TInput from '../Inputs/TInput.tsx'

export const SettingsContext = createContext<TrangaSettings | undefined>(
    undefined
)

export default function Settings({
    setApiUri,
}: {
    setApiUri: (uri: string) => void
}) {
    const Api = useContext(ApiContext)
    const [settings, setSettings] = useState<TrangaSettings>()

    const [open, setOpen] = React.useState(false)

    useEffect(() => {
        Api.settingsList().then((response) => {
            setSettings(response.data)
        })
    }, [Api])

    const apiUriChanged = (
        value: string | number | readonly string[] | undefined
    ) => {
        if (typeof value != 'string') return Promise.reject()
        setApiUri(value)
        return Promise.resolve()
    }

    const ModalStyle: SxProps = {
        width: '80%',
        height: '80%',
    }

    return (
        <SettingsContext.Provider value={settings}>
            <Button onClick={() => setOpen(true)}>Settings</Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog sx={ModalStyle}>
                    <ModalClose />
                    <DialogTitle>Settings</DialogTitle>
                    <DialogContent>
                        <AccordionGroup>
                            <SettingsItem title={'ApiUri'}>
                                <TInput
                                    placeholder={'http(s)://'}
                                    defaultValue={Api.baseUrl}
                                    completionAction={apiUriChanged}
                                />
                            </SettingsItem>
                            <ImageCompression />
                            <FlareSolverr />
                            <DownloadLanguage />
                            <ChapterNamingScheme />
                            <Maintenance />
                        </AccordionGroup>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </SettingsContext.Provider>
    )
}

export function SettingsItem({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) {
    return (
        <Accordion>
            <AccordionSummary>{title}</AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    )
}
