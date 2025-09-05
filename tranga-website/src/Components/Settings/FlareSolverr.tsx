import { ReactNode, useContext } from 'react';
import { SettingsContext, SettingsItem } from './Settings.tsx';
import { ApiContext } from '../../contexts/ApiContext.tsx';
import TInput from '../Inputs/TInput.tsx';

export default function FlareSolverr(): ReactNode {
    const settings = useContext(SettingsContext);
    const Api = useContext(ApiContext);

    const uriChanged = async (value: string | number | readonly string[] | undefined) => {
        if (typeof value != 'string') return Promise.reject();
        try {
            const response = await Api.settingsFlareSolverrUrlCreate(value);
            if (response.ok) return Promise.resolve();
            else return Promise.reject();
        } catch (reason) {
            return await Promise.reject(reason);
        }
    };

    return (
        <SettingsItem title={'FlareSolverr'}>
            <TInput
                placeholder={'FlareSolverr URL'}
                defaultValue={settings?.flareSolverrUrl as string}
                onSubmit={uriChanged}
            />
        </SettingsItem>
    );
}
