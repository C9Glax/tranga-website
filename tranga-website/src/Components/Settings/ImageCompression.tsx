import { ReactNode, useContext } from 'react'
import { SettingsContext, SettingsItem } from './Settings.tsx'
import { Slider } from '@mui/joy'

export default function ImageCompression(): ReactNode {
    const settings = useContext(SettingsContext)

    return (
        <SettingsItem title={'Image Compression'}>
            <Slider
                sx={{ marginTop: '20px' }}
                valueLabelDisplay={'auto'}
                defaultValue={settings?.imageCompression}
            ></Slider>
        </SettingsItem>
    )
}
