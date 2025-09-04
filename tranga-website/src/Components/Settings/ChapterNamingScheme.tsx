import { ReactNode, useContext } from 'react';
import { SettingsContext, SettingsItem } from './Settings.tsx';
import { ApiContext } from '../../contexts/ApiContext.tsx';
import MarkdownPreview from '@uiw/react-markdown-preview';
import TInput from '../Inputs/TInput.tsx';

export default function ChapterNamingScheme(): ReactNode {
    const settings = useContext(SettingsContext);
    const Api = useContext(ApiContext);

    const schemeChanged = async (
        value: string | number | readonly string[] | undefined
    ) => {
        if (typeof value != 'string') return Promise.reject();
        try {
            const response =
                await Api.settingsChapterNamingSchemePartialUpdate(value);
            if (response.ok) return Promise.resolve();
            else return Promise.reject();
        } catch {
            return await Promise.reject();
        }
    };

    return (
        <SettingsItem title={'Chapter Naming Scheme'}>
            <MarkdownPreview
                style={{ backgroundColor: 'transparent' }}
                source={
                    'Placeholders:\n   * %M Obj Name\n   * %V Volume\n   * %C Chapter\n   * %T Title\n   * %A Author (first in list)\n   * %I Chapter Internal ID\n   * %i Obj Internal ID\n   * %Y Year (Obj)\n   *\n   * ?_(...) replace _ with a value from above:\n   * Everything inside the braces will only be added if the value of %_ is not null'
                }
            />
            <TInput
                defaultValue={settings?.chapterNamingScheme as string}
                placeholder={'Scheme'}
                completionAction={schemeChanged}
                actionDelay={5000}
            />
        </SettingsItem>
    );
}
