import { SettingsItem } from './Settings.tsx';
import ImageCompression from './ImageCompression.tsx';
import DownloadLanguage from './DownloadLanguage.tsx';
import ChapterNamingScheme from './ChapterNamingScheme.tsx';

export default function Download() {
    return (
        <SettingsItem title={'Download'}>
            <ImageCompression />
            <DownloadLanguage />
            <ChapterNamingScheme />
        </SettingsItem>
    );
}
