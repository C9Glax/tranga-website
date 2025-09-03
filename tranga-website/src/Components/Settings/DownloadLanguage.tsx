import { ReactNode, useContext } from 'react'
import { SettingsContext, SettingsItem } from './Settings.tsx'
import { ApiContext } from '../../contexts/ApiContext.tsx'
import TInput from '../Inputs/TInput.tsx'

export default function DownloadLanguage(): ReactNode {
    const settings = useContext(SettingsContext)
    const Api = useContext(ApiContext)

    const languageChanged = async (
        value: string | number | readonly string[] | undefined
    ) => {
        if (typeof value != 'string') return Promise.reject()
        try {
            const response =
                await Api.settingsDownloadLanguagePartialUpdate(value)
            if (response.ok) return Promise.resolve()
            else return Promise.reject()
        } catch {
            return await Promise.reject()
        }
    }

    return (
        <SettingsItem title={'Download Language'}>
            <TInput
                defaultValue={settings?.downloadLanguage as string}
                placeholder={"Language code (f.e. 'en')"}
                completionAction={languageChanged}
            />
        </SettingsItem>
    )
}
