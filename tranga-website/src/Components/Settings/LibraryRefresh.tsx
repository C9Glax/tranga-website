import {ChangeEventHandler, ReactNode, useContext, useState} from 'react';
import {SettingsContext, SettingsItem} from './Settings.tsx';
import {ApiContext} from '../../contexts/ApiContext.tsx';
import TButton from "../Inputs/TButton.tsx";
import {LibraryRefreshSetting, PatchLibraryRefreshRecord} from "../../api/data-contracts.ts";
import {Input, Radio, RadioGroup} from "@mui/joy";

export default function LibraryRefresh(): ReactNode {
    const settings = useContext(SettingsContext);
    
    const [value, setValue] = useState<PatchLibraryRefreshRecord>({
        setting: settings?.libraryRefreshSetting ?? LibraryRefreshSetting.AfterAllFinished,
        refreshLibraryWhileDownloadingEveryMinutes: settings?.refreshLibraryWhileDownloadingEveryMinutes
    });
    
    const Api = useContext(ApiContext);

    const updateSetting = async () => {
        try {
            const response = await Api.settingsLibraryRefreshPartialUpdate(value);
            if (response.ok) return Promise.resolve();
            else return Promise.reject();
        } catch {
            return await Promise.reject();
        }
    };
    
    const onSettingChanged : ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue({...value, setting: LibraryRefreshSetting[e.target.value as keyof typeof LibraryRefreshSetting] });
    }
    
    const onMinutesChanged : ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue({...value,  refreshLibraryWhileDownloadingEveryMinutes: e.target.valueAsNumber})
    }

    return (
        <SettingsItem title={'Library Refresh'}>
            <RadioGroup defaultValue={value.setting} onChange={onSettingChanged}>
                {Object.keys(LibraryRefreshSetting).map(e => (
                    <Radio value={e}>{e}</Radio>
                ))}
            </RadioGroup>
            <Input defaultValue={value.refreshLibraryWhileDownloadingEveryMinutes??undefined} onChange={onMinutesChanged} type={"number"} />
            <TButton onClick={updateSetting}>Update</TButton>
        </SettingsItem>
    );
}
