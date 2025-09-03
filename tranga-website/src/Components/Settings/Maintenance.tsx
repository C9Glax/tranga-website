import { SettingsItem } from './Settings.tsx'
import { useContext } from 'react'
import { ApiContext } from '../../contexts/ApiContext.tsx'
import TButton from '../Inputs/TButton.tsx'

export default function Maintenance() {
    const Api = useContext(ApiContext)

    const cleanUnusedManga = async (): Promise<void> => {
        try {
            const result = await Api.maintenanceCleanupNoDownloadMangaCreate()
            if (result.ok) return Promise.resolve()
            else return Promise.reject()
        } catch (reason) {
            return await Promise.reject(reason)
        }
    }

    return (
        <SettingsItem title={'Maintenance'}>
            <TButton completionAction={cleanUnusedManga}>
                Cleanup unused Manga
            </TButton>
        </SettingsItem>
    )
}
