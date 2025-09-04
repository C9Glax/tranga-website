import { SettingsItem } from './Settings.tsx';
import FlareSolverr from './FlareSolverr.tsx';
import { ReactNode } from 'react';

export default function Services(): ReactNode {
    return (
        <SettingsItem title={'Services'}>
            <FlareSolverr />
        </SettingsItem>
    );
}
